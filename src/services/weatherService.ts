import axios from 'axios';

const API_KEY = '19282ecedaefb32c515ea7ba56d4bbe7';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      city: data.name,
      country: data.sys.country,
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};

export const getCitySuggestions = async (query: string): Promise<CitySuggestion[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });

    return response.data.map((city: any) => ({
      name: city.name,
      country: city.country,
      state: city.state,
    }));
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return [];
  }
}; 