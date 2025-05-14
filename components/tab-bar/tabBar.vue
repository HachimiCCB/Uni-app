<template>
    <view class="tab-bar">
        <uv-tabbar :value="props.selected" @change="changeTab">
            <uv-tabbar-item 
                v-for="item in tabBarList" 
                :key="item.id" 
                class="tab-item">
                <template v-slot:active-icon>
                    <image :src="item.selectedIconPath" style="border-radius: 30px; width: 50px; height: 50px;" mode="scaleToFill"/>
					<view class="text-overlay">{{ item.text }}</view>
                </template>
                <template v-slot:inactive-icon>
                    <image :src="item.iconPath" style="border-radius: 30px; width: 50px; height: 50px;" mode="scaleToFill"/>
					<view class="text-overlay">{{ item.text }}</view>
                </template>
            </uv-tabbar-item>
        </uv-tabbar>
    </view>
</template>

<script setup>
    import {
		reactive,
        ref
    } from 'vue'

    const props = defineProps({
        selected: {
            type: Number,
            default: 0
        }
    })
    const tabBarList = ref([{
        "id": 0,
        "pagePath": "/pages/npc",
        "iconPath": "/static/img/common/npc-1.png",
        "selectedIconPath": "/static/img/common/npc-0.png",
        "text": "\u4eba\u7269" //人物
    }, {
        "id": 1,
        "pagePath": "/pages/cook",
        "iconPath": "/static/img/common/food-1.png",
        "selectedIconPath": "/static/img/common/food-0.png",
        "text": "\u6599\u7406" //料理
    }, {
        "id": 2,
        "pagePath": "/pages/drinks",
        "iconPath": "/static/img/common/drinks-1.png",
        "selectedIconPath": "/static/img/common/drinks-0.png",
        "text": "\u996e\u54c1" //饮品
    },{
        "id": 3,
        "pagePath": "/pages/comments",
        "iconPath": "/static/img/common/comments-1.png",
        "selectedIconPath": "/static/img/common/comments-0.png",
        "text": "\u8bc4\u8bba" //评论
    },{
        "id": 4,
        "pagePath": "/pages/setting",
        "iconPath": "/static/img/common/setting-1.png",
        "selectedIconPath": "/static/img/common/setting-0.png",
        "text": "\u8bbe\u7f6e" //设置
    }])
    
    const changeTab = (index) => {
        uni.switchTab({ url: tabBarList.value[index].pagePath })
    }

    uni.hideTabBar()
</script>

<style lang="scss" scoped>
    .tab-item {
        transition: transform 0.3s ease; /* 添加平滑的上移动画 */
    }

    .tab-item:active{
        transform: translateY(-10px); /* 按钮点击时上移10px */
    }
    :deep(.uv-tabbar__content) {
        background-color: #8D6549;
    }
	.icon-wrapper {
	    position: relative; /* 相对定位容器 */
	    width: 50px;
	    height: 50px;
	}
	
	.text-overlay {
	    position: absolute;
	    bottom: -8px; /* 文本覆盖图标下边缘 */
	    left: 50%;
	    transform: translateX(-50%);
	    background: rgba(0,0,0,0.6); /* 半透明背景 */
	    color: white;
	    font-size: 10px;
	    padding: 2px 8px;
	    border-radius: 4px;
	    white-space: nowrap;
	    z-index: 1; /* 确保文本在图标上层 */
	}
    .top-back {
        width: 40px;
        height: 40px;
        position: fixed;
        right: 15px;
        bottom: 80px;
        border-radius: 30px;
        border: 1px solid #fbefcb;
        background-color: #8D6549;
        
        .arrow {
            position: absolute;
            left: 11px;
            top: -1px;
            width: 0;
            height: 0;
            border: 9px solid transparent;
            border-bottom-color: #fbefcb;
        }
        .stick {
            position: absolute;
            left: 16px;
            top: 15px;
            width: 8px;
            height: 14px;
            display: block;
            background-color: #fbefcb;
            -webkit-border-radius: 1px;
            -moz-border-radius: 1px;
            border-radius: 1px;
        }
    }
</style>