import axios from 'axios';
import { Platform } from 'react-native';

// Backend API URL configuration
const RENDER_URL = 'https://weather-app-backend.onrender.com/api'; // Your Render service URL
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
let API_URL = RENDER_URL; // Force using Render URL for testing

console.log('Trying to connect to:', API_URL);

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
  try {
    console.log('Testing connection to:', API_URL);
    const response = await axios.get(`${API_URL}/test`, { 
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    console.log('Backend response:', response.data);
    return true;
  } catch (error: any) {
    console.error('Connection test failed:', error.message);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
    }
    return false;
  }
}; 