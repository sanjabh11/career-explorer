// src/services/OnetService.ts

import axios from 'axios';
import { Occupation, OccupationDetails } from '@/types/onet';

const API_BASE_URL = '/.netlify/functions/onet-proxy';

export const searchOccupations = async (keyword: string): Promise<Occupation[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
    console.log('Raw search response:', response.data);
    // Assuming the API returns an array of occupations in the 'careers' property
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
    const response = await axios.get(`${API_BASE_URL}/details?code=${encodeURIComponent(code)}`);
    console.log('Raw occupation details:', response.data);
    // Process the raw data to match the OccupationDetails interface
    return {
      code: response.data.code,
      title: response.data.title,
      description: response.data.description,
      sample_of_reported_job_titles: response.data.sample_of_reported_job_titles,
      updated: response.data.updated,
      overallAPO: 0, // Set a default value
      categories: [], // You'll need to process the raw data to create categories
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