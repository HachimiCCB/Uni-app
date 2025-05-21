// /js/chat.js
export const sendMessageToAI = async (message) => {
  try {
    // 参数校验
    if (!message?.trim()) throw new Error('消息内容不能为空')

    // 配置参数（正式环境应从安全存储获取）
    const API_KEY = '' // 替换为真实API密钥
    const APP_ID = 'b3a64cafe994432d9e5993d03c104755'

    // 构造请求参数
    const requestConfig = {
      url: `https://dashscope.aliyuncs.com/api/v1/apps/${APP_ID}/completion`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        input: { prompt: message },
        parameters: {},
        debug: {}
      },
      timeout: 60000
    }

    // 发送请求
    const [error, response] = await uni.request(requestConfig)

    // 处理网络错误
    if (error) {
      console.error('网络请求失败:', error)
      throw new Error(`网络连接失败: ${error.errMsg}`)
    }

    // 处理HTTP状态码
    if (response.statusCode !== 200) {
      const requestId = response.header?.['x-dashscope-request-id']
      const errorMsg = response.data?.message || '未知错误'
      console.error(`API异常 [${requestId}]:`, response.data)
      throw new Error(`请求失败 (${response.statusCode}): ${errorMsg}`)
    }

    // 处理返回数据
    if (!response.data?.output?.text) {
      throw new Error('API返回数据格式异常')
    }

    return response.data.output.text

  } catch (error) {
    console.error('完整错误日志:', error)
    throw error // 保持错误冒泡
  }
}