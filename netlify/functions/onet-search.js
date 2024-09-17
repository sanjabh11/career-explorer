const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Function invoked with event:', JSON.stringify(event));
  console.log('ONET_USERNAME:', process.env.ONET_USERNAME ? 'Set' : 'Not set');
  console.log('ONET_PASSWORD:', process.env.ONET_PASSWORD ? 'Set' : 'Not set');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { keyword } = event.queryStringParameters || {};
  
  if (!keyword || !keyword.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Keyword is required' })
    };
  }

  try {
    console.log('Sending request to O*NET API...');
    const url = `https://services.onetcenter.org/ws/mnm/search`;
    console.log('Request URL:', url);

    const response = await axios.get(url, {
      params: {
        keyword: keyword.trim(),
        client: process.env.ONET_USERNAME
      },
      auth: {
        username: process.env.ONET_USERNAME,
        password: process.env.ONET_PASSWORD
      },
      headers: {
        'Accept': 'application/json'
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
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', JSON.stringify(error.response.headers));
      console.error('Error response data:', JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({ 
        error: error.message, 
        details: error.response ? error.response.data : 'No details available' 
      })
    };
  }
};