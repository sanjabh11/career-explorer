import axios from 'axios';
import { Occupation, OccupationDetails } from '@/types/onet';

const API_BASE_URL = 'http://localhost:3001/api/';

export async function searchOccupations(searchTerm: string): Promise<Occupation[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}search`, {
      params: { keyword: searchTerm },
    });
    return response.data.career;
  } catch (error) {
    console.error('Error searching occupations:', error);
    throw error;
  }
}

export async function getOccupationDetails(occupationCode: string): Promise<OccupationDetails> {
  try {
    const response = await axios.get(`${API_BASE_URL}occupation/${occupationCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching occupation details:', error);
    throw error;
  }
}