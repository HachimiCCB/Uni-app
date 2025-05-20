<template>
  <view class="chat-container">
    <view class="chat-header">
      <text>夜雀AI助手</text>
      <uni-icons type="close" size="24" @click="closeChat"></uni-icons>
    </view>
    
    <scroll-view class="chat-messages" scroll-y="true" :scroll-into-view="'msg-' + (messages.length - 1)">
      <view 
        v-for="(msg, index) in messages" 
        :id="'msg-' + index"
        :key="index" 
        :class="['message', msg.role]"
      >
        {{ msg.content }}
      </view>
    </scroll-view>
    
    <view class="chat-input">
      <uv-input 
        v-model="inputText" 
        placeholder="输入消息..." 
        border="none" 
        bgColor="#fbefcb"
        :disabled="isLoading"
      ></uv-input>
      <button @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? '生成中...' : '发送' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { nextTick } from 'vue'

const apiConfig = {
  apiKey: 'sk-1cbc18b0ce0148af9fa8c54081281f55', // 替换为你的实际API Key
  apiUrl: 'https://dashscope.aliyuncs.com/api/v1/apps/b3a64cafe994432d9e5993d03c104755/completion'
}

const messages = ref([
  { role: 'assistant', content: '您好！我是东方夜雀食堂AI助手，如果您对游戏中的料理、人物、玩法感兴趣，请尽管问我~' }
])
const inputText = ref('')
const isLoading = ref(false)

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage = inputText.value.trim()
  messages.value.push({ role: 'user', content: userMessage })

  const assistantMessage = reactive({ role: 'assistant', content: '', loading: true })
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
        input: { prompt: userMessage },
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
                  await new Promise(resolve => setTimeout(resolve, 20)) // 每字间隔20ms
                }
              }
            } catch (e) {
              console.error('解析失败:', e)
            }
          }
        }
      }
      await nextTick()
      uni.pageScrollTo({ selector: `#msg-${messages.value.length - 1}`, duration: 300 })
    }

  } catch (err) {
    console.error('请求失败:', err)
    assistantMessage.content = '抱歉，回答生成失败，请稍后再试。'
  } finally {
    isLoading.value = false
    assistantMessage.loading = false
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
  overflow-anchor: auto;
}

.message {
  max-width: 70%;
  margin-bottom: 20rpx;
  padding: 15rpx 20rpx;
  border-radius: 10rpx;
  word-break: break-word;
  animation: fadeIn 0.3s ease;
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
  gap: 10rpx;
  background-color: white;
  border-top: 1rpx solid #eee;
}

button {
  background-color: #8D6549;
  color: white;
  padding: 0 30rpx;
  border-radius: 8rpx;
}

button:disabled {
  opacity: 0.7;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>