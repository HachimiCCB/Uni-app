<template>
    <view class="setting">
        <uv-notice-bar :text="notice" color="#830000"></uv-notice-bar>
        <uv-toast ref="toast"></uv-toast>
        
        <!-- 登录状态显示区域 -->
        <view class="user-status" v-if="isLoggedIn">
            <text class="username">当前用户: {{ userInfo.username }}</text>
            <button @click="switchAccount" class="switch-btn">切换账号</button>
        </view>
        <button v-else @click="navigateToLogin" class="login-btn">登录</button>
        
        <button @click="restartApp()">重启应用</button>
        <button @click="test()">测试模式</button>
    </view>
    
    <uv-loading-page :loading="loading" loading-text="读取中..." font-size="20px" loading-mode="semicircle" bgColor="#8D6549"></uv-loading-page>
    <uv-modal ref="clearCacheModal" content='该操作会将所有数据重置!应用会自动重启!' :showCancelButton='true' @confirm="clearCache()"></uv-modal>
    <uv-modal ref="confirmModal" :content='confirmText'></uv-modal>
    <tab-bar :selected="4"></tab-bar>
	<GlobalChatButton/>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import tabBar from '@/components/tab-bar/tabBar.vue'
import GlobalChatButton from '@/components/GlobalChatButton/GlobalChatButton.vue'
import { initCache } from '../js/common.js'

const notice = ref('关注Anon Tokyo喵，关注Anon Tokyo谢谢喵!!!!')
const fileData = reactive({
    'npc': 'npcData',
    'npcRecommend': 'npcData',
    'location': 'locationData',
    'drink': 'drinksData',
    'cook': 'cookData',
    'matrial': 'materialData',
    'drinksTag': 'drinkTagData',
    'cookTag': 'cookTagData',
})

// 登录状态相关
const isLoggedIn = ref(false)
const userInfo = reactive({
    username: '',
    loggedIn: false
})

// 检查登录状态
const checkLoginStatus = () => {
    const storedUser = uni.getStorageSync('userInfo')
    if (storedUser && storedUser.loggedIn) {
        isLoggedIn.value = true
        userInfo.username = storedUser.username
        userInfo.loggedIn = storedUser.loggedIn
    } else {
        isLoggedIn.value = false
        userInfo.username = ''
        userInfo.loggedIn = false
    }
}

watch(isLoggedIn, (newVal) => {
  if (newVal) {
    checkLoginStatus() // 当登录状态变化时再次检查
  }
})

// 跳转到登录页面
const navigateToLogin = () => {
    uni.navigateTo({
        url: '/pages/login'
    })
}

// 切换账号
const switchAccount = () => {
    // 清除用户信息
    uni.removeStorageSync('userInfo')
    isLoggedIn.value = false
    userInfo.username = ''
    userInfo.loggedIn = false
    
    // 跳转到登录页面
    navigateToLogin()
}

// 初始化时检查登录状态
onShow(() => {
    checkLoginStatus()
})

const loading = ref(false)
const toast = ref('')
const showToast = (params) => {
    toast.value.show({
        ...params,
        complete() {
            params.url && uni.navigateTo({
                url: params.url
            })
        }
    })
}

const clearCacheModal = ref('')
const confirmText = ref('')
const confirmModal = ref('')
const restartApp = () => {
    // 重启时清除登录状态
    uni.removeStorageSync('userInfo')
    isLoggedIn.value = false
    userInfo.username = ''
    userInfo.loggedIn = false
    
    if ('android' === envType.value) {
        try{
            plus.runtime.restart()
        }catch(e){
            uni.reLaunch({
                url: 'npc'
            })
        }
    }
}

const clearCache = () => {
    uni.clearStorageSync()
    initCache()
    showToast({
        type: 'success',
        message: "缓存重置成功!",
        duration: 500
    })
    restartApp()
}

const envType = ref('')
uni.getSystemInfo({
    success: (res) => {
        envType.value = res.platform.toLowerCase();
        console.log('getSystemInfo', res.platform.toLowerCase());
    },
    fail: (err) => {
        console.log('getSystemInfo', err);
        showToast({
            type: 'error',
            message: "getSystemInfo error!" + err,
            duration: 2000
        })
    }
})

const test = (params) => {
    if ('android' === envType.value) {
        plus.runtime.restart()
    }
}

const compareAB = (a, b) => {
    let a0 = a[0]
    let b0 = b[0]
    if ('string' === typeof b0) {
        return false
    } else{
        for (key in a0) {
            let vala = a0[key]
            if ('[object Undefined]' === Object.prototype.toString.call(b0[key])) {
                return true
            }
            if ('[object string]' !== Object.prototype.toString.call(vala)) {
                if ('[object Array]' === Object.prototype.toString.call(vala)) {
                    let valKeya = vala[0]
                    for (valKeyKey in valKeya) {
                        let valKeya0 = valKeya[valKeyKey]
                        if ('[object Undefined]' === Object.prototype.toString.call(b0[key][0][valKeyKey])) {
                            return true
                        }
                    }
                } else if ('[object Object]' === Object.prototype.toString.call(vala)) {
                    for (valKey in vala) {
                        let valKeya = vala[valKey]
                        if ('[object Undefined]' === Object.prototype.toString.call(b0[key][valKey])) {
                            return true
                        }
                    }
                }
            }
        }
    }
}

const readFile = (fileName) => {
    loading.value = true
    const File = plus.android.importClass('java.io.File');
    const InputStreamReader = plus.android.importClass('java.io.InputStreamReader');
    const BufferedReader = plus.android.importClass('java.io.BufferedReader');
    const FileInputStream = plus.android.importClass('java.io.FileInputStream');
    let file = new File(fileName);
    let inputStreamReader = null;
    let bufferedReader = null;
    let list = '';

    try {
        let index = fileName.lastIndexOf('/')
        let fileDataName = fileName.substr(index + 1).split('.')[0].split('_')[0]
        console.log('--', fileData[fileDataName]);
        if ('[object Undefined]' === Object.prototype.toString.call(fileData[fileDataName])) {
            showToast({
                type: 'warning',
                message: "请选择8种文件类型文件!",
                duration: 1000
            })
        }
        
        if (!file.exists()) {
            return false;
        }
        inputStreamReader = new InputStreamReader(new FileInputStream(file), 'utf-8');
        bufferedReader = new BufferedReader(inputStreamReader);
        let line = '';
        while (null != (line = bufferedReader.readLine())) {
            list += line;
        }
        console.log('fileContent', list);
        let json = ''
        if ('location' === fileDataName || 'drinksTag' === fileDataName || 'cookTag' === fileDataName) {
            json = list.replace(/，/g, ",").replace(/ /g, "").split(',')
        } else {
            json = JSON.parse(list)
        }
        if ('npcRecommend' !== fileDataName && compareAB(uni.getStorageSync(fileData[fileDataName]), json)) {
            confirmText.value = '当前版本APP中，'+ fileDataName +' 文件结构已更改，请使用最新文件进行导入操作！'
            confirmModal.value.open()
        } else {
            if ('npcRecommend' !== fileDataName) {
                uni.setStorageSync(fileData[fileDataName], json)
            } else {
                let jsonMap = ref([])
                json.forEach(item => {
                    jsonMap.value[item.chinese] = item
                })
                let npcDatas = uni.getStorageSync(fileData[fileDataName])
                npcDatas.forEach(item => {
                    if (jsonMap.value.hasOwnProperty(item.chinese)) {
                        for (keys in jsonMap.value[item.chinese]) {
                            item[keys] = jsonMap.value[item.chinese][keys]
                        }
                    }
                })
                uni.setStorageSync(fileData[fileDataName], npcDatas)
            }
            
            showToast({
                type: 'success',
                message: "文件导入成功!",
                duration: 500
            })
        }
    } catch (e) {
        console.log(e);
        showToast({
            type: 'error',
            icon: false,
            message: "文件读取失败! " + e,
            duration: 2500
        })
        if (null != bufferedReader) {
            bufferedReader.close();
        }
        if (null != inputStreamReader) {
            inputStreamReader.close();
        }
    } finally {
        loading.value = false
        bufferedReader.close();
        inputStreamReader.close();
    }
}

const chooseFile = () => {
    var CODE_REQUEST = 1000;
    var main = plus.android.runtimeMainActivity();
    if (plus.os.name == 'Android') {
        var Intent = plus.android.importClass('android.content.Intent');
        var intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        main.onActivityResult = function(requestCode, resultCode, data) {
            if (requestCode == CODE_REQUEST) {
                var uri = data.getData();
                plus.android.importClass(uri);
                var Build = plus.android.importClass('android.os.Build');
                var over4less10 = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
                var over10 = Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q;
                var DocumentsContract = plus.android.importClass('android.provider.DocumentsContract');
                console.log("jjjjjjjjjjjjjjjjjj", uri.getScheme());

                try {
                    if (over4less10 && !over10 && DocumentsContract.isDocumentUri(main, uri)) {
                        console.log('111', uri.getAuthority());
                        if ("com.android.externalstorage.documents" == uri.getAuthority()) {
                            var docId = DocumentsContract.getDocumentId(uri);
                            var split = docId.split(":");
                            var type = split[0];
                            console.log('333', type);

                            if ("primary" == type) {
                                var Environment = plus.android.importClass('android.os.Environment');
                                console.log('333444', Environment.getExternalStorageDirectory() + "/" + split[1]);
                                readFile(Environment.getExternalStorageDirectory() + "/" + split[1])
                            } else {
                                var System = plus.android.importClass('java.lang.System');
                                var sdPath = System.getenv("SECONDARY_STORAGE");
                                console.log('333555', sdPath + "/" + split[1]);
                                readFile(sdPath + "/" + split[1])
                            }
                        }
                        else if ("com.android.providers.downloads.documents" == uri.getAuthority()) {
                            var id = DocumentsContract.getDocumentId(uri);
                            var ContentUris = plus.android.importClass('android.content.ContentUris');
                            var Uri = plus.android.importClass('android.net.Uri');
                            var contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), id);
                            console.log('333666', getDataColumn(main, contentUri, null, null));
                            readFile(getDataColumn(main, contentUri, null, null))
                        }
                        else if ("com.android.providers.media.documents" == uri.getAuthority()) {
                            var docId = DocumentsContract.getDocumentId(uri);
                            var split = docId.split(":");
                            var type = split[0];

                            var MediaStore = plus.android.importClass('android.provider.MediaStore');
                            if ("image" == type) {
                                contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                            } else if ("video" == type) {
                                contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                            } else if ("audio" == type) {
                                contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                            }

                            var selection = "_id=?";
                            var selectionArgs = new Array();
                            selectionArgs[0] = split[1];
                            console.log('111', MediaStore);

                            console.log('333777', getDataColumn(main, contentUri, selection, selectionArgs));
                            readFile(getDataColumn(main, contentUri, selection, selectionArgs))
                        }
                    } else if (over10) {
                        plus.android.importClass(main.getContentResolver());
                        let contentResolver = main.getContentResolver();
                        if (contentResolver.SCHEME_FILE === uri.getScheme()) {
                            console.log('4444444444', uri.getPath());
                            readFile(uri.getPath())
                        } else {
                            let cursor = contentResolver.query(uri, null, null, null, null)
                            plus.android.importClass(cursor);
                            if (cursor.moveToFirst()) {
                                var openableColumns = plus.android.importClass('android.provider.OpenableColumns')
                                var displayName = cursor.getString(cursor.getColumnIndex(openableColumns.DISPLAY_NAME))
                                const File = plus.android.importClass('java.io.File')
                                const FileUtils = plus.android.importClass('android.os.FileUtils')
                                const FileOutputStream = plus.android.importClass('java.io.FileOutputStream')
                                const InputStream = plus.android.importClass('java.io.InputStream')
                                let file = null
                                try {
                                    let is = contentResolver.openInputStream(uri)
                                    let file1 = new File(main.getExternalCacheDir().getAbsolutePath())
                                    if (!file1.exists())
                                    {
                                        file1.mkdir()
                                    }
                                    let cache = new File(file1.getPath(), displayName)
                                    let fos = new FileOutputStream(cache)
                                    FileUtils.copy(is, fos)
                                    file = cache
                                    fos.close()
                                    is.close()
                                    console.log('5555555555', file.getAbsolutePath())
                                    readFile(file.getAbsolutePath())
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        }
                    } else if ("content" === uri.getScheme()) {
                        console.log('333888', getDataColumn(main, uri, null, null));
                        readFile(getDataColumn(main, uri, null, null))
                    } else if ("file" === uri.getScheme()) {
                        console.log('333999', uri.getPath());
                        readFile(uri.getPath())
                    }
                } catch (e) {
                    console.log(e);
                    showToast({
                        type: 'error',
                        icon: false,
                        message: "文件路径获取失败! " + e,
                        duration: 2500
                    })
                }
            }
        }
        main.startActivityForResult(intent, CODE_REQUEST);
    }
}

const getDataColumn = (main, uri, selection, selectionArgs) => {
    let res = ''
    try {
        plus.android.importClass(main.getContentResolver());
        let cursor = main.getContentResolver().query(uri, ['_data'], selection, selectionArgs, null);
        plus.android.importClass(cursor);
        if (cursor != null && cursor.moveToFirst()) {
            var column_index = cursor.getColumnIndexOrThrow('_data');
            var result = cursor.getString(column_index)
            res = result;
            cursor.close();
        }
    } catch (e) {
        console.log(e);
        showToast({
            type: 'error',
            icon: false,
            message: "文件路径获取失败! " + e,
            duration: 2500
        })
    }

    return res;
}
</script>

<style lang="scss" scoped>
.setting {
    height: calc(100vh - 120px);
    background-color: #8D6549;
    padding: 10px;
    
    .user-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
        padding: 10px;
        background-color: rgba(251, 239, 203, 0.3);
        border-radius: 8px;
        
        .username {
            color: #fbefcb;
            font-size: 14px;
        }
    }
    
    button {
        margin: 10px 0;
        background-color: #fbefcb;
        color: #5C3A21;
        
        &.login-btn {
            background-color: #8D6549;
            color: #fbefcb;
            border: 1px solid #fbefcb;
        }
        
        &.switch-btn {
            background-color: transparent;
            color: #fbefcb;
            border: 1px solid #fbefcb;
            font-size: 12px;
            padding: 4px 8px;
        }
    }
}
</style>