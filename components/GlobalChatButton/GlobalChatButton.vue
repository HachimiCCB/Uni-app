<template>
  <view class="global-chat-button" @click="openChat">
    <uni-icons type="chat" size="25" color="#8D6549"></uni-icons>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const openChat = () => {
  uni.navigateTo({
    url: '/pages/ChatAssistant2'
  })
}
</script>

<style scoped>
.global-chat-button {
  position: fixed;
  right: 20rpx;
  top: 20rpx;
  width: 60rpx;
  height: 60rpx;
  background-color: #fbefcb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.2);
}
</style>