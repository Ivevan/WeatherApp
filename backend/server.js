const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.com'] // Replace with your actual frontend domain
    : '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' })); // Limit payload size

// Verify API key exists
if (!process.env.WEATHER_API_KEY) {
  console.error('ERROR: Missing WEATHER_API_KEY in environment variables!');
  console.error('Please set WEATHER_API_KEY in your environment or .env file');
  process.exit(1);
}

// API Routes
const apiRouter = express.Router();

// Input validation middleware
const validateCity = (req, res, next) => {
  const city = req.query.city;
  if (!city || typeof city !== 'string' || city.length > 100) {
    return res.status(400).json({ error: 'Invalid city parameter' });
  }
  // Sanitize input - remove any characters that aren't letters, spaces, or commas
  req.query.city = city.replace(/[^a-zA-Z\s,]/g, '');
  next();
};

const validateQuery = (req, res, next) => {
  const query = req.query.query;
  if (!query || typeof query !== 'string' || query.length > 100) {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }
  // Sanitize input
  req.query.query = query.replace(/[^a-zA-Z\s,]/g, '');
  next();
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Weather API is running' });
});

// Test endpoint
apiRouter.get('/test', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is reachable' });
});

// Weather endpoint with validation
apiRouter.get('/weather', validateCity, async (req, res) => {
  try {
    const { city } = req.query;
    console.log(`Fetching weather data for city: ${city}`);

    const response = await axios.get(`${process.env.WEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric',
      },
      timeout: 5000 // 5 second timeout
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

    // Cache headers
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
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

// Cities endpoint with validation
apiRouter.get('/cities', validateQuery, async (req, res) => {
  try {
    const { query } = req.query;
    console.log(`Searching cities with query: ${query}`);

    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5,
        appid: process.env.WEATHER_API_KEY,
      },
      timeout: 5000 // 5 second timeout
    });

    const citySuggestions = response.data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
    }));

    // Cache headers
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.json(citySuggestions);
  } catch (error) {
    console.error('Error fetching city suggestions:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to fetch city suggestions' });
  }
});

// Mount the API router
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Server running on port ${PORT}`);
}); 