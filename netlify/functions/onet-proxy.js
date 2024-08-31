const axios = require('axios');

   exports.handler = async function(event, context) {
     console.log('Function invoked with event:', JSON.stringify(event));
     const { path, queryStringParameters } = event;
     const url = `https://services.onetcenter.org${path}${queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''}`;
     
     console.log('Requesting URL:', url);
     console.log('Username:', process.env.ONET_USERNAME);
     console.log('Password:', process.env.ONET_PASSWORD ? '[REDACTED]' : 'Not set');

     try {
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
       console.log('O*NET API Response Data:', JSON.stringify(response.data));

       return {
         statusCode: 200,
         headers: {
           "Access-Control-Allow-Origin": "*",
           "Access-Control-Allow-Headers": "Content-Type, Authorization",
           "Content-Type": "application/json"
         },
         body: JSON.stringify(response.data)
       };
     } catch (error) {
       console.error('Error in Netlify Function:', error.message);
       console.error('Error response:', error.response ? JSON.stringify(error.response.data) : 'No response');
       return {
         statusCode: error.response ? error.response.status : 500,
         headers: {
           "Access-Control-Allow-Origin": "*",
           "Access-Control-Allow-Headers": "Content-Type, Authorization",
           "Content-Type": "application/json"
         },
         body: JSON.stringify({ error: error.message, details: error.response ? error.response.data : 'No details available' })
       };
     }
   };