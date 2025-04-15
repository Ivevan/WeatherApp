import axios from 'axios';
import { Platform } from 'react-native';

// Backend API URL configuration
// For development computer IP - use your computer's IP address on your network
// Physical devices need to connect to your computer's actual IP address
const DEVELOPMENT_MACHINE_IP = '192.168.253.46'; // Updated to current IP address

// API URL selection logic
let API_URL: string;

// Try multiple possible endpoints for maximum compatibility
const possibleEndpoints = [
  `http://${DEVELOPMENT_MACHINE_IP}:3000/api`,
  `http://localhost:3000/api`,
  `http://10.0.2.2:3000/api`,  // Special Android emulator hostname
];

if (Platform.OS === 'android') {
  API_URL = `http://${DEVELOPMENT_MACHINE_IP}:3000/api`;
} else if (Platform.OS === 'ios') {
  API_URL = `http://${DEVELOPMENT_MACHINE_IP}:3000/api`;
} else {
  API_URL = 'http://localhost:3000/api';
}

console.log('Using API URL:', API_URL);
console.log('Will try these fallback URLs if needed:', possibleEndpoints);

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
  country: string;
}

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
}

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    console.log(`Fetching weather data for city: ${city}`);
    console.log(`API URL: ${API_URL}/weather`);
    
    const response = await axios.get(`${API_URL}/weather`, {
      params: {
        city: city,
      },
    });

    console.log('Weather data fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
    }
    throw new Error('Failed to fetch weather data');
  }
};

export const getCitySuggestions = async (query: string): Promise<CitySuggestion[]> => {
  if (!query.trim()) return [];
  
  try {
    console.log(`Fetching city suggestions for query: ${query}`);
    console.log(`API URL: ${API_URL}/cities`);
    
    const response = await axios.get(`${API_URL}/cities`, {
      params: {
        query: query,
      },
    });

    console.log('City suggestions fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
    }
    return [];
  }
};

export const testBackendConnection = async (): Promise<boolean> => {
  // Try each endpoint until one works
  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`Testing backend connection to ${endpoint}/test...`);
      const response = await axios.get(`${endpoint}/test`);
      console.log('Backend connection successful:', response.data);
      
      // If successful, update the main API_URL
      API_URL = endpoint;
      console.log('Updated primary API_URL to:', API_URL);
      
      return true;
    } catch (error: any) {
      console.error(`Backend connection to ${endpoint} failed:`, error.message);
      // Continue to the next endpoint
    }
  }
  
  console.error('All backend connection attempts failed');
  return false;
}; 