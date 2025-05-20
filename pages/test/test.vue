<template>
  <view class="container">
    <button @click="callDashScope">测试API</button>
    <text v-if="result">{{ result }}</text>
    <text v-if="error" style="color: red;">{{ error }}</text>
  </view>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      result: '',
      error: ''
    }
  },
  methods: {
    async callDashScope() {
      // 注意：这里仅限测试使用！生产环境必须通过服务端中转
      const apiKey = 'sk-1cbc18b0ce0148af9fa8c54081281f55'; // 临时替换为你的API Key
      const appId = 'b3a64cafe994432d9e5993d03c104755';      // 替换为你的应用ID

      const url = `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`;

      const data = {
        input: { prompt: "你是谁？" },
        parameters: {},
        debug: {}
      };

      try {
        const response = await axios.post(url, data, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          this.result = response.data.output.text;
          console.log('API Response:', response.data);
        } else {
          this.error = `请求失败：${response.data.message}`;
        }
      } catch (error) {
        this.error = `请求异常：${error.message}`;
        console.error('Error details:', error.response?.data);
      }
    }
  }
}
</script>