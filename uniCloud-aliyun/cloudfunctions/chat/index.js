// 'use strict';

// exports.main = async (event, context) => {
//   try {
//     // 参数校验
//     if (!event?.message?.trim()) {
//       throw new Error('消息内容不能为空');
//     }
	
// 	const db = uniCloud.database();
// 	const collection = db.collection('api');

//     // 构造请求数据
//     const requestData = {
//       input: {
//         prompt: event.message
//       },
//       parameters: {},
//       debug: {}
//     };

//     // 调用阿里百炼 DashScope 接口
//     const response = await uniCloud.httpclient.request('https://dashscope.aliyuncs.com/api/v1/apps/b3a64cafe994432d9e5993d03c104755/completion', {
//       method: 'POST',
//       contentType: 'json',
//       dataType: 'json',
//       timeout: 60000,
//       data: requestData,
//       headers: {
//         'Authorization': 'Bearer sk-1cbc18b0ce0148af9fa8c54081281f55',
//         'Content-Type': 'application/json'
//       }
//     });

//     // 检查HTTP状态码
//     if (response.status !== 200) {
//       const errorMsg = response.data?.error?.message || '未知错误';
//       throw new Error(`API异常 (状态码 ${response.status}): ${errorMsg}`);
//     }

//     // 检查返回数据结构是否符合预期
//     const result = response.data;
//     const output = result?.output;
//     if (!output) {
//       throw new Error('API返回数据格式异常');
//     }

//     // 返回 output 作为最终结果
//     return output.text;

//   } catch (error) {
//     console.error('完整错误日志:', error);

//     // 保持错误时返回JSON结构
//     return {
//       code: error.errCode || 500,
//       message: error.message || '服务暂时不可用，请稍后重试'
//     };
//   }
// };
'use strict';

exports.main = async (event, context) => {
  try {
    // 参数校验
    if (!event?.message?.trim()) {
      throw new Error('消息内容不能为空');
    }
    
    const db = uniCloud.database();
    const collection = db.collection('api');

    // 从云数据库api表中获取apikey
    const apiKeyRes = await collection.where({
      appid: 'b3a64cafe994432d9e5993d03c104755' // 根据特定的appid查询
    }).get();

    if (!apiKeyRes.data || apiKeyRes.data.length === 0) {
      throw new Error('未找到API密钥');
    }

    // 获取第一条记录的apikey
    const apiKey = apiKeyRes.data[0].apikey;

    // 构造请求数据
    const requestData = {
      input: {
        prompt: event.message
      },
      parameters: {},
      debug: {}
    };

    // 调用阿里百炼 DashScope 接口
    const response = await uniCloud.httpclient.request('https://dashscope.aliyuncs.com/api/v1/apps/b3a64cafe994432d9e5993d03c104755/completion', {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      timeout: 60000,
      data: requestData,
      headers: {
        'Authorization': `Bearer ${apiKey}`, // 使用从数据库获取的apiKey
        'Content-Type': 'application/json'
      }
    });

    // 检查HTTP状态码
    if (response.status !== 200) {
      const errorMsg = response.data?.error?.message || '未知错误';
      throw new Error(`API异常 (状态码 ${response.status}): ${errorMsg}`);
    }

    // 检查返回数据结构是否符合预期
    const result = response.data;
    const output = result?.output;
    if (!output) {
      throw new Error('API返回数据格式异常');
    }

    // 返回 output 作为最终结果
    return output.text;

  } catch (error) {
    console.error('完整错误日志:', error);

    // 保持错误时返回JSON结构
    return {
      code: error.errCode || 500,
      message: error.message || '服务暂时不可用，请稍后重试'
    };
  }
};