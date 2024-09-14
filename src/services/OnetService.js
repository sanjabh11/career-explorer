import axios from 'axios';
import API_BASE_URL from '../config'; // Assuming you've created this file as suggested earlier

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const searchOccupations = async (keyword) => {
  try {
    console.log('Searching occupations with keyword:', keyword);
    if (!keyword.trim()) {
      return [];
    }
    const response = await api.get(`/onet-search`, {
      params: { keyword: encodeURIComponent(keyword.trim()) }
    });
    console.log('Search response:', response.data);
    return response.data.career || [];
  } catch (error) {
    console.error('Error searching occupations:', error);
    console.error('Error details:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    throw error;
  }
};

export const getOccupationDetails = async (code) => {
  try {
    console.log('Fetching occupation details for code:', code);
    const response = await api.get(`/onet-details`, {
      params: { code: encodeURIComponent(code) }
    });
    console.log('Raw details response:', JSON.stringify(response.data, null, 2));
    
    // Extract relevant data from the response
    const details = response.data.details || {};
    const processedData = {
      description: details.description?.[0] || '',
      code: details.code?.[0] || '',
      title: details.title?.[0] || '',
      tasks: (response.data.tasks?.task || []).map(task => ({
        name: task.statement?.[0] || '',
        description: task.statement?.[0] || ''
      })),
      knowledge: (response.data.knowledge?.element || []).map(item => ({
        name: item.name?.[0] || '',
        description: item.description?.[0] || '',
        value: item.score?.[0]?._ || '',
        scale: item.score?.[0]?.$.scale_name || ''
      })),
      skills: (response.data.skills?.element || []).map(item => ({
        name: item.name?.[0] || '',
        description: item.description?.[0] || '',
        value: item.score?.[0]?._ || '',
        scale: item.score?.[0]?.$.scale_name || ''
      })),
      abilities: (response.data.abilities?.element || []).map(item => ({
        name: item.name?.[0] || '',
        description: item.description?.[0] || '',
        value: item.score?.[0]?._ || '',
        scale: item.score?.[0]?.$.scale_name || ''
      })),
      technologies: (response.data.technology_skills?.category || []).flatMap(category => 
        (category.example || []).map(ex => ({
          name: typeof ex === 'string' ? ex : ex._ || '',
          description: category.title?.[0]?._ || '',
          commodityCode: category.title?.[0]?.$.id || '',
          hotTechnology: typeof ex === 'object' && 'hot_technology' in ex,
          inDemand: false // This information is not provided in the current data structure
        }))
      ).filter(tech => tech.name !== ''),
      sample_of_reported_job_titles: details.sample_of_reported_job_titles?.[0]?.title?.filter(Boolean) || [],
      updated: details.updated?.[0]?.year?.[0] || ''
    };
    
    console.log('Processed occupation details:', JSON.stringify(processedData, null, 2));
    return processedData;
  } catch (error) {
    console.error('Error fetching occupation details:', error.response?.data || error.message);
    throw error;
  }
};

// ... keep the rest of the file as is ...