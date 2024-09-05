const axios = require('axios');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const { keyword } = event.queryStringParameters;
  
  if (!keyword || !keyword.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Keyword is required' })
    };
  }

  try {
    const response = await axios.get(`https://services.onetcenter.org/ws/mnm/search`, {
      params: {
        keyword: keyword.trim(),
        client: process.env.ONET_USERNAME
      },
      auth: {
        username: process.env.ONET_USERNAME,
        password: process.env.ONET_PASSWORD
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};