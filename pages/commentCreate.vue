<template>
  <view class="container">
    <!-- 评论输入区域 -->
    <textarea 
      v-model="comment" 
      placeholder="请输入评论内容..." 
      class="textarea"
      placeholder-class="placeholder-style"
    />

    <!-- 图片上传区域 -->
    <view class="upload-area">
      <view 
        class="upload-item" 
        v-for="(img, index) in images" 
        :key="index"
        @click="previewImage(index)"
      >
        <image :src="img" class="uploaded-image" mode="aspectFill" />
        <view class="delete-icon" @click.stop="deleteImage(index)">
          <uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
        </view>
      </view>
      <view 
        class="upload-btn" 
        @click="chooseImage"
        v-if="images.length < 3"
      >
        <uni-icons type="plusempty" size="40" color="#8B5A2B"></uni-icons>
        <text class="upload-tip">最多3张</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="button-group">
      <button 
        type="default" 
        @click="submitComment"
        :disabled="!comment.trim()"
        class="submit-btn"
      >提交</button>
      <button 
        type="default" 
        @click="cancelComment"
        class="cancel-btn"
      >取消</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const comment = ref('')
const images = ref([])
const db = uniCloud.database();

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

const submitComment = () => {
  if (!comment.value.trim()) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '提交中...' })
  setTimeout(() => {
	db.collection('comment').add({ user_id: 'client_test', content: comment.value, })
    uni.hideLoading()
    uni.showToast({ title: '提交成功', icon: 'success' })
    comment.value = ''
    images.value = []
  }, 1500)
}

const cancelComment = () => {
  if (comment.value.trim() || images.value.length > 0) {
    uni.showModal({
      title: '提示',
      content: '确定取消编辑吗？',
      success: (res) => {
        if (res.confirm) {
          comment.value = ''
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
</style>