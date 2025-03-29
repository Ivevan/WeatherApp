const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ status: 'OK', message: 'Backend is reachable' });
});

app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const response = await axios.get(`${process.env.WEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    const weatherData = {
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      city: data.name,
      country: data.sys.country,
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/api/cities', async (req, res) => {
  try {
    const { query } = req.query;
    console.log(`Received request for cities with query: ${query}`);
    
    if (!query || !query.trim()) {
      console.log('Empty query, returning empty array');
      return res.json([]);
    }

    console.log(`Making request to OpenWeatherMap API with query: ${query}`);
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5,
        appid: process.env.WEATHER_API_KEY,
      },
    });

    const citySuggestions = response.data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
    }));

    console.log(`Found ${citySuggestions.length} suggestions`);
    res.json(citySuggestions);
  } catch (error) {
    console.error('Error fetching city suggestions:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch city suggestions' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log(`For external devices, use: http://<your-computer-ip>:${PORT}`);
}); 