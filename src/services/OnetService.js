import axios from 'axios';

const api = axios.create({
  baseURL: '/ws',
});

api.interceptors.request.use(config => {
  const username = process.env.REACT_APP_ONET_USERNAME;
  const password = process.env.REACT_APP_ONET_PASSWORD;
  config.auth = {
    username: username,
    password: password
  };
  return config;
});

export const searchOccupations = async (keyword) => {
  try {
    const response = await api.get(`/online/search?keyword=${encodeURIComponent(keyword)}`);
    console.log('API Response:', response.data);
    if (response.data && response.data.occupation) {
      return response.data.occupation;
    } else {
      console.warn('Unexpected response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error searching occupations:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getOccupationDetails = async (code) => {
  try {
    const formattedCode = code.includes('-') ? code : code.replace(/^(\d{2})(\d{4})$/, '\$1-\$2.00');
    console.log('Fetching details for occupation code:', formattedCode);

    const details = await api.get(`/online/occupations/${formattedCode}`);
    console.log('Details response:', details.data);

    let tasks = [], skills = [], technologies = [];

    try {
      const tasksResponse = await api.get(`/online/occupations/${formattedCode}/details/tasks`);
      tasks = tasksResponse.data && tasksResponse.data.element ? tasksResponse.data.element : [];
    } catch (error) {
      console.warn('Error fetching tasks:', error);
    }

    try {
      const skillsResponse = await api.get(`/online/occupations/${formattedCode}/details/skills`);
      skills = skillsResponse.data && skillsResponse.data.element ? skillsResponse.data.element : [];
    } catch (error) {
      console.warn('Error fetching skills:', error);
      if (error.response && error.response.status !== 422) {
        throw error;
      }
    }

    try {
      const technologiesResponse = await api.get(`/online/occupations/${formattedCode}/details/technology_skills`);
      technologies = technologiesResponse.data && technologiesResponse.data.element ? technologiesResponse.data.element : [];
    } catch (error) {
      console.warn('Error fetching technologies:', error);
      if (error.response && error.response.status !== 422) {
        throw error;
      }
    }

    return {
      details: details.data,
      tasks,
      skills,
      technologies
    };
  } catch (error) {
    console.error('Error fetching occupation details:', error.response ? error.response.data : error.message);
    console.error('Error status:', error.response ? error.response.status : 'Unknown');
    console.error('Error headers:', error.response ? error.response.headers : 'Unknown');
    throw error;
  }
};