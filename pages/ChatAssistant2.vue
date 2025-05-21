<template>
  <view class="chat-container">
    <view class="chat-header">
      <text>夜雀AI助手</text>
      <uni-icons type="close" size="24" @click="closeChat"></uni-icons>
    </view>
    
    <scroll-view 
      class="chat-messages" 
      scroll-y="true" 
      :scroll-into-view="'msg-' + (messages.length - 1)"
      :scroll-with-animation="true"
    >
      <view 
        v-for="(msg, index) in messages" 
        :id="'msg-' + index"
        :key="index" 
        :class="['message-bubble', msg.role]"
      >
        <view class="message-content">{{ msg.content }}</view>
        <view class="message-time">{{ formatTime(msg.timestamp) }}</view>
      </view>
    </scroll-view>
    
    <view class="chat-input-area">
      <uv-input 
        v-model="inputText" 
        placeholder="输入消息..." 
        border="none" 
        bgColor="#fbefcb"
        :disabled="isLoading"
        class="chat-input"
      ></uv-input>
      <button 
        @click="sendMessage" 
        :disabled="isLoading || !inputText.trim()"
        class="send-button"
      >
        <uni-icons 
          :type="isLoading ? 'spinner-cycle' : 'paperplane'" 
          size="20" 
          :color="isLoading || !inputText.trim() ? '#aaa' : '#fff'"
        ></uni-icons>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { nextTick } from 'vue'

const db = uniCloud.database();

const apiConfig = {
  apiKey: '',
  apiUrl: 'https://dashscope.aliyuncs.com/api/v1/apps/b3a64cafe994432d9e5993d03c104755/completion'
}

onMounted(async () => {
    const res = await db.collection('api').where({
      appid: 'b3a64cafe994432d9e5993d03c104755'
    }).get()

    console.log('apikey：', res.result.data[0].apikey)

    const key = res.result.data[0].apikey
	apiConfig.apiKey = key
})

const messages = ref([
  { 
    role: 'assistant', 
    content: '您好！我是东方夜雀食堂AI助手，如果您对游戏中的料理、人物、玩法感兴趣，请尽管问我~',
    timestamp: new Date()
  }
])
const inputText = ref('')
const isLoading = ref(false)

const formatTime = (date) => {
  if (!date) return ''
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage = {
    role: 'user',
    content: inputText.value.trim(),
    timestamp: new Date()
  }
  messages.value.push(userMessage)

  const assistantMessage = reactive({ 
    role: 'assistant', 
    content: '', 
    loading: true,
    timestamp: new Date()
  })
  messages.value.push(assistantMessage)

  inputText.value = ''
  isLoading.value = true

  try {
    const response = await fetch(apiConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-SSE': 'enable'
      },
      body: JSON.stringify({
        input: { prompt: userMessage.content },
        parameters: { incremental_output: true },
        debug: {}
      })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split(/\n\n/)
      buffer = events.pop() || ''

      for (const event of events) {
        const lines = event.split('\n')
        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const json = JSON.parse(line.slice(5).trim())
              const text = json.output?.text || ''
              if (text) {
                for (const char of text) {
                  assistantMessage.content += char
                  await nextTick()
                  await new Promise(resolve => setTimeout(resolve, 20))
                }
              }
            } catch (e) {
              console.error('解析失败:', e)
            }
          }
        }
      }
      await nextTick()
      uni.pageScrollTo({ 
        selector: `#msg-${messages.value.length - 1}`, 
        duration: 300 
      })
    }

  } catch (err) {
    console.error('请求失败:', err)
    assistantMessage.content = '抱歉，回答生成失败，请稍后再试。'
  } finally {
    isLoading.value = false
    assistantMessage.loading = false
    assistantMessage.timestamp = new Date()
  }
}

const closeChat = () => {
  uni.redirectTo({
    url: '/' + getCurrentPages().pop().route
  })
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.chat-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #8D6549, #B38B6D);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.chat-header text {
  font-size: 18px;
  font-weight: 500;
}

.chat-messages {
  flex: 1;
  padding: 16px 12px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.message-bubble {
  max-width: 80%;
  margin-bottom: 16px;
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 16px;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.user .message-content {
  background: linear-gradient(135deg, #8D6549, #B38B6D);
  color: white;
  border-bottom-right-radius: 4px;
  margin-left: auto;
}

.assistant .message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  margin-right: auto;
  border: 1px solid #eee;
}

.user .message-time {
  text-align: right;
  padding-right: 8px;
}

.assistant .message-time {
  text-align: left;
  padding-left: 8px;
}

.chat-input-area {
  padding: 20rpx;
    display: flex;
    gap: 10rpx;
    background-color: white;
    border-top: 1rpx solid #eee;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.chat-input {
  flex: 1;
  background-color: white;
  border-radius: 5px;
  padding: 10px 16px;
  font-size: 16px;
}

.send-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8D6549, #8D6549);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.send-button:active {
  transform: scale(0.95);
}

.send-button:disabled {
  background: #ddd;
  transform: none;
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #d4aa76;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8D6549;
}
</style>