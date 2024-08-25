const axios = require('axios');
const { parseString } = require('xml2js');
const util = require('util');

const parseXml = util.promisify(parseString);

module.exports = async (req, res) => {
  console.log('Function invoked with query:', JSON.stringify(req.query));
  const { code, type } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Occupation code is required' });
  }

  const baseUrl = 'https://services.onetcenter.org/ws/online/occupations';
  let endpoints = [''];

  if (type) {
    endpoints = [`/details/${type}`];
  } else {
    endpoints = [
      '',
      '/details/tasks',
      '/details/knowledge',
      '/details/skills',
      '/details/abilities',
      '/details/technology_skills'
    ];
  }

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

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error in Vercel Function:', error.message);
    console.error('Error response:', error.response ? JSON.stringify(error.response.data) : 'No response');
    res.status(error.response ? error.response.status : 500).json({ 
      error: error.message, 
      details: error.response ? error.response.data : 'No details available' 
    });
  }
};