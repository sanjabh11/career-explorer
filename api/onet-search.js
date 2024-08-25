const axios = require('axios');
const { parseString } = require('xml2js');
const util = require('util');

const parseXml = util.promisify(parseString);

module.exports = async (req, res) => {
  console.log('Function invoked with query:', JSON.stringify(req.query));
  const { keyword } = req.query;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  const url = `https://services.onetcenter.org/ws/online/search?keyword=${encodeURIComponent(keyword)}`;
  
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
        'Accept': 'application/xml'
      }
    });
    
    console.log('O*NET API Response Status:', response.status);

    const xmlData = response.data;
    const jsonData = await parseXml(xmlData);

    console.log('Parsed JSON Data:', JSON.stringify(jsonData, null, 2));

    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error in Vercel Function:', error.message);
    console.error('Error response:', error.response ? JSON.stringify(error.response.data) : 'No response');
    res.status(error.response ? error.response.status : 500).json({ 
      error: error.message, 
      details: error.response ? error.response.data : 'No details available' 
    });
  }
};