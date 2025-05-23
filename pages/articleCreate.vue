<template>
	<view class="container">
		<textarea v-model="title" placeholder="请输入标题" class="titlearea" placeholder-class="placeholder-style" />
		<!-- 文章内容输入区域 -->
		<textarea v-model="content" placeholder="请输入文章内容" class="textarea" placeholder-class="placeholder-style" />
		<!-- 简介输入区域 -->
		<textarea v-model="summary" placeholder="请输入文章简介（可选）" class="titlearea" placeholder-class="placeholder-style" />


		<!-- 图片上传区域 -->
		<view class="upload-area">
			<view class="upload-item" v-for="(img, index) in images" :key="index" @click="previewImage(index)">
				<image :src="img" class="uploaded-image" mode="aspectFill" />
				<view class="delete-icon" @click.stop="deleteImage(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
			</view>
			<view class="upload-btn" @click="chooseImage" v-if="images.length < 3">
				<uni-icons type="plusempty" size="40" color="#8B5A2B"></uni-icons>
				<text class="upload-tip">最多3张</text>
			</view>
		</view>
		
		<!-- 标签输入区域 -->
		<view class="tag-area">
			<view class="tag-input-box">
				<input v-model="newTag" class="tag-input" placeholder="输入标签后点击 + 添加" />
				<button class="add-tag-btn" @click="addTag">+</button>
			</view>
			<view class="tag-list">
				<view class="tag-item" v-for="(tag, index) in tags" :key="index">
					<text>{{ tag }}</text>
					<text class="remove-tag" @click="removeTag(index)">×</text>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="button-group">
			<button type="default" @click="submitArticle" :disabled="!content.trim()" class="submit-btn">提交</button>
<!-- 			<button type="default" @click="submitImage" :disabled="!content.trim()" class="submit-btn">图片测试</button> -->
			<button type="default" @click="cancelArticle" class="cancel-btn">取消</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'

	const title = ref('')
	const content = ref('')
	const images = ref([])
	const summary = ref('')
	const db = uniCloud.database();
	const userInfo = uni.getStorageSync('userInfo')
	
	
	if (userInfo && userInfo.loggedIn) {
	  console.log('当前登录用户：', userInfo.username)
	} else {
	  uni.showModal({
	    title: '提示',
	    content: '请先登录',
	    showCancel: false,
	    confirmText: '确定',
	    success: () => {
	      uni.switchTab({
	        url: '/pages/setting' // 替换为你的登录页路径
	      })
	    }
	  })
	}

	const chooseImage = () => {
		uni.chooseImage({
			count: 3 - images.value.length,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				images.value = images.value.concat(res.tempFilePaths)
			}
		})
	}

	const deleteImage = (index) => {
		uni.showModal({
			title: '提示',
			content: '确定删除这张图片吗？',
			success: (res) => {
				if (res.confirm) {
					images.value.splice(index, 1)
				}
			}
		})
	}

	const previewImage = (index) => {
		uni.previewImage({
			current: index,
			urls: images.value
		})
	}
	
	const tags = ref([])
	const newTag = ref('')
	
	const addTag = () => {
		if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
			tags.value.push(newTag.value.trim())
			newTag.value = ''
		} else {
			uni.showToast({ title: '标签重复或为空', icon: 'none' })
		}
	}
	
	const removeTag = (index) => {
		tags.value.splice(index, 1)
	}

	const submitArticle = async () => {
	  // 处理简介，如果为空则取文章前两行
	  let finalSummary = summary.value.trim()
	  if (!finalSummary) {
	    const lines = content.value.split('\n').filter(l => l.trim())
	    finalSummary = lines.slice(0, 2).join(' ')
	  }
	  
	  if (!content.value.trim()) {
	    uni.showToast({ title: '请输入文章内容', icon: 'none' });
	    return;
	  }
	
	  uni.showLoading({ title: '提交中...' });
	
	  try {
	    // 1. 上传所有图片到云存储
	    const uploadedImages = await Promise.all(
	      images.value.map(async (tempPath) => {
	        const res = await uniCloud.uploadFile({
	          filePath: tempPath,
	          cloudPath: `article_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`
	        });
	        return res.fileID; // 获取云端文件ID
	      })
	    );
	
	    // 2. 提交数据到数据库（包含所有图片路径）
	    await db.collection('article').add({
	      title: title.value,
	      author: userInfo.username,
	      content: content.value,
	      summary: finalSummary,
	      coverImage: uploadedImages[0], // 第一张作为封面
	      images: uploadedImages, // 保存所有图片
	      publishDate: new Date(),
	      lastUpdated: new Date(),
	      tags: tags.value,
	    });
	
	    // 3. 清空表单并跳转
	    uni.hideLoading();
	    uni.showToast({ title: '提交成功', icon: 'success' });
	    title.value = '';
	    summary.value = '';
	    tags.value = [];
	    content.value = '';
	    images.value = [];
	    
	    // 可选：跳转到文章列表页
	    // uni.navigateBack();
	    
	  } catch (err) {
	    uni.hideLoading();
	    uni.showToast({ title: '提交失败，请重试', icon: 'none' });
	    console.error('提交错误:', err);
	    
	    // 可选：保留已填写内容以便用户修改后重新提交
	    // 不自动清空表单字段
	  }
	};

// 以下代码是“测试提交图片”的功能，仅供测试，实际应当在点击提交时同时就把选择的图片URL上传
	const submitImage = () => {
		if (images.value.length === 0) {
			uni.showToast({
				title: '请先选择图片',
				icon: 'none'
			});
			return;
		}
		const filePath = images.value[0];
		uniCloud.uploadFile({
			filePath: filePath,
			cloudPath: "test_" + Date.now() + ".png", // 上传到云存储的文件名
		}).then(res => {
			console.log(res);
		})
	}

	const cancelArticle = () => {
		if (content.value.trim() || images.value.length > 0) {
			uni.showModal({
				title: '提示',
				content: '确定取消编辑吗？',
				success: (res) => {
					if (res.confirm) {
						content.value = ''
						images.value = []
					}
				}
			})
		} else {
			uni.navigateBack()
		}
	}
</script>

<style lang="scss">
.container {
	padding: 30rpx;
	background-color: #f8f3ee;
	min-height: 100vh;
}

.textarea {
	width: 100%;
	border: 2rpx solid #d4b999;
	padding: 24rpx;
	border-radius: 16rpx;
	height: 240rpx;
	margin-bottom: 30rpx;
	font-size: 28rpx;
	background-color: #f5e9dc;
	color: #5c3a21;
	box-sizing: border-box;
	transition: all 0.3s ease;

	&:focus {
		border-color: #b78d64;
		background-color: #f0dfc8;
		box-shadow: 0 0 8rpx rgba(139, 90, 43, 0.2);
	}
}

.titlearea {
	width: 100%;
	border: 2rpx solid #d4b999;
	padding: 24rpx;
	border-radius: 16rpx;
	height: 90rpx;
	margin-bottom: 30rpx;
	font-size: 28rpx;
	background-color: #f5e9dc;
	color: #5c3a21;
	box-sizing: border-box;
	transition: all 0.3s ease;

	&:focus {
		border-color: #b78d64;
		background-color: #f0dfc8;
		box-shadow: 0 0 8rpx rgba(139, 90, 43, 0.2);
	}
}

.placeholder-style {
	color: #a0866d;
	font-size: 28rpx;
}

.upload-area {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.upload-item {
	position: relative;
	width: 220rpx;
	height: 220rpx;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	transition: transform 0.3s;

	&:active {
		transform: scale(0.95);
	}
}

.uploaded-image {
	width: 100%;
	height: 100%;
}

.delete-icon {
	position: absolute;
	right: 8rpx;
	top: 8rpx;
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
}

.upload-btn {
	width: 220rpx;
	height: 220rpx;
	border: 2rpx dashed #d4b999;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: rgba(245, 233, 220, 0.5);
	transition: all 0.3s;

	&:active {
		background-color: rgba(240, 223, 200, 0.7);
	}

	.upload-tip {
		font-size: 24rpx;
		color: #8B5A2B;
		margin-top: 10rpx;
	}
}

.button-group {
	display: flex;
	gap: 30rpx;
	margin-top: 60rpx;

	button {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		border-radius: 40rpx;
		transition: all 0.3s;
		border: none;

	}
}

.submit-btn {
	background: linear-gradient(145deg, #D2B48C, #B8860B);
	color: #5C3A21;
	font-weight: bold;
	box-shadow: 0 4rpx 8rpx rgba(139, 90, 43, 0.2);

	&[disabled] {
		background: #E6D5B8;
		color: #5C3A21;
		opacity: 0.7;
	}

	&:not([disabled]):active {
		background: linear-gradient(145deg, #B8860B, #D2B48C);
		transform: scale(0.98);
	}
}

.cancel-btn {
	background-color: #f8f3ee;
	color: #8B5A2B;
	border: 1rpx solid #d4b999;

	&:active {
		background-color: #f0e5d8;
	}
}
.tag-area {
	margin-bottom: 40rpx;
}

.tag-input-box {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;

	.tag-input {
		flex: 1;
		padding: 16rpx;
		border: 2rpx solid #d4b999;
		border-radius: 12rpx;
		background-color: #f5e9dc;
		font-size: 28rpx;
		color: #5c3a21;
	}

	.add-tag-btn {
		margin-left: 20rpx;
		padding: 0 24rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 12rpx;
		background-color: #d2b48c;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
	}
}

.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.tag-item {
	display: flex;
	align-items: center;
	padding: 8rpx 16rpx;
	background-color: #e6d5b8;
	border-radius: 20rpx;
	color: #5c3a21;
	font-size: 24rpx;

	.remove-tag {
		margin-left: 10rpx;
		color: #8b5a2b;
		cursor: pointer;
	}
}

</style>