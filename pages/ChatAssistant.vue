<template>
  <view class="chat-container">
    <view class="chat-header">
      <text>AI助手</text>
      <uni-icons type="close" size="24" @click="closeChat"></uni-icons>
    </view>
    
    <scroll-view class="chat-messages" scroll-y="true">
      <view v-for="(msg, index) in messages" :key="index" 
            :class="['message', msg.role]">
        {{ msg.content }}
      </view>
    </scroll-view>
    
    <view class="chat-input">
      <uv-input v-model="inputText" placeholder="输入消息..." 
                border="none" bgColor="#fbefcb"></uv-input>
      <button @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const messages = ref([
  { role: 'assistant', content: '你好！我是AI助手，有什么可以帮您的吗？' }
])
const inputText = ref('')

const sendMessage = async () => {
  if (!inputText.value.trim()) return
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputText.value
  })
  
  const userMessage = inputText.value
  inputText.value = ''
  
  try {
    // 调用API接口
    const res = await uniCloud.callFunction({
      name: 'chat',
      data: {
        message: userMessage
      }
    })
    
    // 添加AI回复
    messages.value.push({
      role: 'assistant',
      content: res.result
    })
  } catch (err) {
    console.error('API调用失败:', err)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，我暂时无法回答这个问题'
    })
  }
}

const closeChat = () => {
  // 获取当前页面路径
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = currentPage.route
  
  // 重启当前页面
  uni.redirectTo({
    url: '/' + url
  })
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f3ee;
}

.chat-header {
  padding: 20rpx;
  background-color: #8D6549;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  padding: 20rpx;
}

.message {
  max-width: 70%;
  margin-bottom: 20rpx;
  padding: 15rpx 20rpx;
  border-radius: 10rpx;
}

.user {
  background-color: #d4aa76;
  margin-left: auto;
}

.assistant {
  background-color: #fbefcb;
  margin-right: auto;
}

.chat-input {
  padding: 20rpx;
  display: flex;
  background-color: white;
  border-top: 1rpx solid #eee;
}
</style>