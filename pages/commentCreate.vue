<template>
  <view class="container">
    <!-- 评论输入区域 -->
    <textarea v-model="comment" placeholder="请输入评论内容..." class="textarea" />

    <!-- 图片上传区域 -->
    <view class="upload-area">
      <view class="upload-item" v-for="(img, index) in images" :key="index">
        <image :src="img" class="uploaded-image" />
      </view>
      <view class="upload-btn" @click="chooseImage">+</view>
    </view>

    <!-- 操作按钮 -->
    <view class="button-group">
      <button type="primary" @click="submitComment">提交</button>
      <button type="default" @click="cancelComment">取消</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const comment = ref('')
const images = ref([])
const db = uniCloud.database();

const chooseImage = () => {
  uni.chooseImage({
    count: 3,
    success: (res) => {
      images.value = images.value.concat(res.tempFilePaths)
    }
  })
}

const submitComment = () => {
  // 这里可以添加提交逻辑，如上传到服务器等
  console.log('提交内容:', comment.value)
  console.log('图片列表:', images.value)
  db.collection('comment').add({ user_id: 'client_test', content: comment.value, })
}

const cancelComment = () => {
  comment.value = ''
  images.value = []
}
</script>

<style>
.container {
  padding: 20rpx;
}
.textarea {
  border: 1rpx solid #ccc;
  padding: 20rpx;
  border-radius: 10rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}
.upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;
}
.upload-item {
  width: 150rpx;
  height: 150rpx;
  border: 1rpx solid #ddd;
}
.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upload-btn {
  width: 400rpx;
  height: 150rpx;
  border: 2rpx dashed #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #999;
}
.button-group {
  display: flex;
  gap: 20rpx;
}
</style>
