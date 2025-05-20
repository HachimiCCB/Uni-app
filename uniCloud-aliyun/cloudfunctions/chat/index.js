'use strict';
const axios = require('axios');

exports.main = async (event, context) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: event.message}]
    }, {
      headers: {
        'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('API Error:', err);
    return '抱歉，我暂时无法回答这个问题';
  }
};