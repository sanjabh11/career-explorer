import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
});

export const searchOccupations = async (keyword) => {
  try {
    console.log('Searching occupations with keyword:', keyword);
    const response = await api.get(`/.netlify/functions/onet-search?keyword=${encodeURIComponent(keyword)}`);
    console.log('Search Occupations Response:', response.data);

    return response.data.occupations || [];
  } catch (error) {
    console.error('Error searching occupations:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getOccupationDetails = async (occupationCode) => {
  try {
    console.log('Fetching occupation details for:', occupationCode);
    const response = await api.get(`/.netlify/functions/onet-details?code=${encodeURIComponent(occupationCode)}`);
    console.log('Occupation Details Response:', response.data);

    const processedData = {
      ...response.data.details,
      tasks: processElementData(response.data.tasks, 'tasks'),
      knowledge: processElementData(response.data.knowledge, 'knowledge'),
      skills: processElementData(response.data.skills, 'skills'),
      abilities: processElementData(response.data.abilities, 'abilities'),
      technologies: processElementData(response.data.technology_skills, 'technologies')
    };

    console.log('Processed Occupation Details:', processedData);

    return processedData;
  } catch (error) {
    console.error('Error fetching occupation details:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const processElementData = (data, category) => {
  if (!data) return [];
  
  if (Array.isArray(data.element)) {
    return data.element.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      value: item.score?.value,
      scale: item.score?.scale
    }));
  }
  
  if (Array.isArray(data.task)) {
    return data.task.map(item => ({
      id: item.id,
      name: item.statement,
      description: item.statement,
      value: item.score?.value,
      scale: item.score?.scale
    }));
  }
  
  if (category === 'technologies' && Array.isArray(data.category)) {
    return data.category.flatMap(category => 
      category.example.map(item => ({
        id: item.id || item.name, // Use name as fallback for id
        name: item.name,
        description: category.title?.name || 'No description available',
        value: item.hot_technology ? "Hot Technology" : "Standard Technology",
        scale: undefined
      }))
    ).filter(item => item.name); // Filter out items without a name
  }
  
  console.warn('Unhandled data structure:', data);
  return [];
};

const fetchData = async (endpoint) => {
  try {
    const response = await api.get(`/.netlify/functions/onet-proxy${endpoint}`);
    console.log(`Raw response for ${endpoint}:`, JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.warn(`No data available for ${endpoint}`);
    } else {
      console.error(`Error fetching ${endpoint}:`, error.response ? error.response.data : error.message);
    }
    return null;
  }
};

export const getOccupationDetailsWithTasks = async (formattedCode) => {
  try {
    const [tasks, knowledge, skills, abilities, technologies] = await Promise.all([
      fetchData(`/ws/online/occupations/${formattedCode}/details/tasks`),
      fetchData(`/ws/online/occupations/${formattedCode}/details/knowledge`),
      fetchData(`/ws/online/occupations/${formattedCode}/details/skills`),
      fetchData(`/ws/online/occupations/${formattedCode}/details/abilities`),
      fetchData(`/ws/online/occupations/${formattedCode}/details/technology_skills`)
    ]);

    console.log('Processed API Responses:', {
      tasks: processElementData(tasks, 'tasks'),
      knowledge: processElementData(knowledge, 'knowledge'),
      skills: processElementData(skills, 'skills'),
      abilities: processElementData(abilities, 'abilities'),
      technologies: processElementData(technologies, 'technologies')
    });

    return {
      tasks: processElementData(tasks, 'tasks') || [],
      knowledge: processElementData(knowledge, 'knowledge') || [],
      skills: processElementData(skills, 'skills') || [],
      abilities: processElementData(abilities, 'abilities') || [],
      technologies: processElementData(technologies, 'technologies') || []
    };
  } catch (error) {
    console.error('Error fetching occupation details:', error);
    throw error;
  }
};

export default {
  searchOccupations,
  getOccupationDetails,
  getOccupationDetailsWithTasks
};
