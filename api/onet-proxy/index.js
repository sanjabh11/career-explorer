import axios from 'axios';

export default async function handler(req, res) {
  console.log('API route hit:', req.url);
  console.log('Query parameters:', req.query);

  const { path } = req.query;
  const url = `https://services.onetcenter.org${path}`;
  
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in Vercel Function:', error.message);
    console.error('Error response:', error.response ? JSON.stringify(error.response.data) : 'No response');
    res.status(error.response ? error.response.status : 500).json({ 
      error: error.message, 
      details: error.response ? error.response.data : 'No details available' 
    });
  }
}