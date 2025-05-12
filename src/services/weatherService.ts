import axios from 'axios';
import { Platform } from 'react-native';

// Backend API URL configuration
const RENDER_URL = 'https://weatherapp-5qa7.onrender.com/api'; // Production URL on Render
const LOCAL_IP = 'http://192.168.209.46:3000/api';

// Try multiple possible endpoints for maximum compatibility
const possibleEndpoints = [
  // Production URL (Render)
  RENDER_URL,
  // Local development URLs
  LOCAL_IP,
  // Android emulator specific address
  'http://10.0.2.2:3000/api',
  // Localhost for development
  'http://localhost:3000/api'
];

// Default API URL to be updated after successful connection
let API_URL = __DEV__ ? LOCAL_IP : RENDER_URL;

console.log('Environment:', __DEV__ ? 'Development' : 'Production');
console.log('Initial API URL:', API_URL);

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
      timeout: 10000, // Add timeout to prevent hanging requests
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
    throw new Error('Failed to fetch weather data. Please check your connection and try again.');
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
      timeout: 5000, // Add timeout to prevent hanging requests
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
      const response = await axios.get(`${endpoint}/test`, { timeout: 3000 });
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