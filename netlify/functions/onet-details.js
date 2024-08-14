const axios = require('axios'); // Ensure this line is present
const { parseString } = require('xml2js');
const util = require('util');

// Rest of your code...
exports.handler = async function(event, context) {
  console.log('Function invoked with event:', JSON.stringify(event));
  const { code } = event.queryStringParameters || {};
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Occupation code is required' })
    };
  }

  const baseUrl = 'https://services.onetcenter.org/ws/online/occupations';
  const endpoints = [
    '',
    '/details/tasks',
    '/details/knowledge',
    '/details/skills',
    '/details/abilities',
    '/details/technology_skills'
  ];

  try {
    const results = await Promise.all(endpoints.map(async (endpoint) => {
      const url = `${baseUrl}/${code}${endpoint}`;
      console.log('Requesting URL:', url);
      
      const response = await axios.get(url, {
        auth: {
          username: process.env.ONET_USERNAME,
          password: process.env.ONET_PASSWORD
        },
        headers: {
          'Accept': 'application/xml'
        }
      });

      const xmlData = response.data;
      const jsonData = await parseXml(xmlData);
      console.log(`Data for ${endpoint}:`, JSON.stringify(jsonData, null, 2));
      return { endpoint, data: jsonData };
    }));

    const combinedData = results.reduce((acc, { endpoint, data }) => {
      if (endpoint === '') {
        acc.details = data.occupation;
      } else {
        const key = endpoint.split('/').pop();
        acc[key] = data[Object.keys(data)[0]];
      }
      return acc;
    }, {});

    console.log('Combined Data:', JSON.stringify(combinedData, null, 2));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(combinedData)
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
