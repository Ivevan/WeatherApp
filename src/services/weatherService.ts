import axios from 'axios';
import { Platform } from 'react-native';

// Backend API URL configuration
// For development computer IP - use your computer's IP address on your network
// Physical devices need to connect to your computer's actual IP address
const DEVELOPMENT_MACHINE_IP = '192.168.21.46'; // Your computer's IP address

// API URL selection logic
let API_URL: string;

if (Platform.OS === 'android') {
  // For Android devices: use development machine IP for physical devices
  API_URL = `http://${DEVELOPMENT_MACHINE_IP}:3000/api`;
} else if (Platform.OS === 'ios') {
  // For iOS devices (simulator uses localhost, physical uses IP)
  API_URL = `http://${DEVELOPMENT_MACHINE_IP}:3000/api`;
} else {
  // Default for web
  API_URL = 'http://localhost:3000/api';
}

console.log('Using API URL:', API_URL);

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
  try {
    console.log('Testing backend connection...');
    console.log(`API URL: ${API_URL}/test`);
    
    const response = await axios.get(`${API_URL}/test`);
    console.log('Backend connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    if (axios.isAxiosError(error)) {
      console.error('Network Error Details:', error.message);
      console.error('Is Network Error:', error.isAxiosError);
    }
    return false;
  }
}; 