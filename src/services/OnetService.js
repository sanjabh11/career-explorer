    import axios from 'axios';

   const api = axios.create({
     baseURL: process.env.REACT_APP_API_BASE_URL || '',
   });

   export const searchOccupations = async (keyword) => {
     try {
       console.log('Searching occupations with keyword:', keyword);
       const response = await api.get(`/.netlify/functions/onet-proxy/ws/online/search?keyword=${encodeURIComponent(keyword)}`);
       console.log('Search Occupations Response:', response.data);

       return response.data.occupations || [];
     } catch (error) {
       console.error('Error searching occupations:', error.response ? error.response.data : error.message);
       throw error;
     }
   };

api.interceptors.request.use(config => {
  console.log('API Request Config:', config);
  return config;
});

const processElementData = (data) => {
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
  
  if (Array.isArray(data.category)) {
    return data.category.flatMap(category => 
      category.example.map(item => ({
        id: item.name,
        name: item.name,
        description: category.title?.name || 'No description available',
        value: item.hot_technology ? "Hot Technology" : undefined,
        scale: undefined
      }))
    );
  }
  
  console.warn('Unhandled data structure:', data);
  return [];
};

       

       return response.data.occupations || [];
     } catch (error) {
       console.error('Error searching occupations:', error.response ? error.response.data : error.message);
       throw error;
     }
   };

export const getOccupationDetails = async (code) => {
  try {
    const formattedCode = code.includes('-') ? code : code.replace(/^(\d{2})(\d{4})$/, '\$1-\$2.00');
    console.log('Fetching details for occupation code:', formattedCode);

    const details = await api.get(`/.netlify/functions/onet-proxy/ws/online/occupations/${formattedCode}`);
    
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

    const [tasks, knowledge, skills, abilities, technologies] = await Promise.all([
      fetchData(`/ws/online/occupations/${formattedCode}/details/tasks`),
      fetchData(`/ws/online/occupations/${formattedCode}/details/knowledge`),
      fetchData(`/ws/online/occupations/${formattedCode}/details/skills`),
      fetchData(`/ws/online/occupations/${formattedCode}/details/abilities`),
      fetchData(`/ws/online/occupations/${formattedCode}/details/technology_skills`)
    ]);

    console.log('Processed API Responses:', {
      details: details.data,
      tasks: processElementData(tasks),
      knowledge: processElementData(knowledge),
      skills: processElementData(skills),
      abilities: processElementData(abilities),
      technologies: processElementData(technologies)
    });

    return {
      details: details.data,
      tasks: processElementData(tasks) || [],
      knowledge: processElementData(knowledge) || [],
      skills: processElementData(skills) || [],
      abilities: processElementData(abilities) || [],
      technologies: processElementData(technologies) || []
    };
  } catch (error) {
    console.error('Error fetching occupation details:', error);
    throw error;
  }
};