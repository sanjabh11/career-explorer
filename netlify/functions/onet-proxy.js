const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Function invoked with event:', JSON.stringify(event));
  console.log('ONET_USERNAME:', process.env.ONET_USERNAME ? 'Set' : 'Not set');
  console.log('ONET_PASSWORD:', process.env.ONET_PASSWORD ? 'Set' : 'Not set');

  const { keyword } = event.queryStringParameters || {};
  
  if (!keyword) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Keyword is required' })
    };
  }

  try {
    console.log('Sending request to O*NET API...');
    const url = `https://services.onetcenter.org/ws/mnm/search?keyword=${encodeURIComponent(keyword)}`;
    console.log('Request URL:', url);

    const response = await axios.get(url, {
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error in Netlify Function:', error.message);
    console.error('Error response:', error.response ? JSON.stringify(error.response.data) : 'No response');
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error.message, 
        details: error.response ? error.response.data : 'No details available' 
      })
    };
  }
};