const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Function invoked with event:', JSON.stringify(event));
  console.log('Environment variables:', process.env.ONET_USERNAME, process.env.ONET_PASSWORD ? '[REDACTED]' : 'Not set');

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
    console.log('Sending request to O*NET API...');
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
    
    console.log('O*NET API Response Status:', response.status);
    console.log('O*NET API Response Headers:', JSON.stringify(response.headers));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error in Netlify Function:', error.message);
    console.error('Error response:', error.response ? JSON.stringify(error.response.data) : 'No response');
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({ error: error.message, details: error.response ? error.response.data : 'No details available' })
    };
  }
};