const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verify API key exists
if (!process.env.WEATHER_API_KEY) {
  console.error('ERROR: Missing WEATHER_API_KEY in environment variables!');
  console.error('Please set WEATHER_API_KEY in your environment or .env file');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint for health checks
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Weather API is running' });
});

// API Routes
const apiRouter = express.Router();

// Test endpoint
apiRouter.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ status: 'OK', message: 'Backend is reachable' });
});

// Weather endpoint
apiRouter.get('/weather', async (req, res) => {
  try {
    const { city } = req.query;
    console.log(`Fetching weather data for city: ${city}`);
    
    if (!city) {
      console.log('No city provided in request');
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

    console.log(`Successfully fetched weather data for ${city}`);
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    if (error.response) {
      console.error('OpenWeatherMap API response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Cities endpoint
apiRouter.get('/cities', async (req, res) => {
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
      console.error('Status code:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch city suggestions' });
  }
});

// Mount the API router
app.use('/api', apiRouter);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/test');
  console.log('- GET /api/weather?city=<cityname>');
  console.log('- GET /api/cities?query=<searchterm>');
}); 