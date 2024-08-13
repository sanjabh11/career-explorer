   const axios = require('axios');

   exports.handler = async function(event, context) {
     const { path } = event;
     const url = `https://services.onetcenter.org${path}`;
     
     try {
       const response = await axios.get(url, {
         auth: {
           username: process.env.REACT_APP_ONET_USERNAME,
           password: process.env.REACT_APP_ONET_PASSWORD
         }
       });
       
       return {
         statusCode: 200,
         body: JSON.stringify(response.data)
       };
     } catch (error) {
       return {
         statusCode: error.response ? error.response.status : 500,
         body: JSON.stringify({ error: error.message })
       };
     }
   };