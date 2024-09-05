const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_BASE_URL = 'https://services.onetcenter.org/ws/mnm/careers/';
const API_KEY = process.env.ONET_API_KEY;

app.get('/api/search', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}search`, {
      params: {
        keyword: req.query.keyword,
        client: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching occupations' });
  }
});

app.get('/api/occupation/:code', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${req.params.code}`, {
      params: {
        client: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching occupation details' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));