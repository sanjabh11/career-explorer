// src/services/OnetService.ts

import axios from 'axios';
import { Occupation, OccupationDetails } from '@/types/onet';

const API_BASE_URL = '/.netlify/functions/onet-proxy';

export const searchOccupations = async (keyword: string): Promise<Occupation[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.ONET_USERNAME}:${process.env.ONET_PASSWORD}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    });
    console.log('Raw search response:', response.data);
    return response.data.careers.map((career: any) => ({
      code: career.code,
      title: career.title
    }));
  } catch (error) {
    console.error('Error searching occupations:', error);
    throw error;
  }
};

export const getOccupationDetails = async (code: string): Promise<OccupationDetails> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/details?code=${encodeURIComponent(code)}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.ONET_USERNAME}:${process.env.ONET_PASSWORD}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    });
    console.log('Raw occupation details:', response.data);
    return {
      code: response.data.code,
      title: response.data.title,
      description: response.data.description,
      sample_of_reported_job_titles: response.data.sample_of_reported_job_titles,
      updated: response.data.updated,
      overallAPO: 0,
      categories: [],
      tasks: response.data.tasks || [],
      knowledge: response.data.knowledge || [],
      skills: response.data.skills || [],
      abilities: response.data.abilities || [],
      technologies: response.data.technology_skills || [],
    };
  } catch (error) {
    console.error('Error fetching occupation details:', error);
    throw error;
  }
};