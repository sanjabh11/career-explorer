const axios = require('axios'); // Ensure this line is present
const { parseString } = require('xml2js');
const util = require('util');

// Rest of your code...
exports.handler = async function(event, context) {
  console.log('Function invoked with event:', JSON.stringify(event));
  const { keyword } = event.queryStringParameters || {};
  
  if (!keyword) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Keyword is required' })
    };
  }

  const url = `https://services.onetcenter.org/ws/online/search?keyword=${encodeURIComponent(keyword)}`;
  
  console.log('Requesting URL:', url);

  try {
    const response = await axios.get(url, {
      auth: {
        username: process.env.ONET_USERNAME,
        password: process.env.ONET_PASSWORD
      },
      headers: {
        'Accept': 'application/xml'
      }
    });
    
    console.log('O*NET API Response:', response.data);

    const xmlData = response.data;
    const jsonData = await parseXml(xmlData);
    console.log('Parsed JSON Data:', JSON.stringify(jsonData, null, 2));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ occupations: jsonData.occupations.occupation || [] })
    };
  } catch (error) {
    console.error('Error in Netlify Function:', error.message);
    console.error('Error response:', error.response ? JSON.stringify(error.response.data) : 'No response');
    return {
      statusCode: error.response ? error.response.status : 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: error.message, details: error.response ? error.response.data : 'No details available' })
    };
  }
};
