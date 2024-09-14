const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/.netlify/functions'
  : 'http://localhost:8888/.netlify/functions';

export default API_BASE_URL;