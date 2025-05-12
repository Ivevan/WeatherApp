const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
require('dotenv').config();

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security

// HTTP request logging
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
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
  logger.error('Missing WEATHER_API_KEY in environment variables!');
  process.exit(1);
}

// API Routes
const apiRouter = express.Router();

// Input validation middleware
const validateCity = (req, res, next) => {
  const city = req.query.city;
  if (!city || typeof city !== 'string' || city.length > 100) {
    logger.warn(`Invalid city parameter received: ${city}`);
    return res.status(400).json({ error: 'Invalid city parameter' });
  }
  // Sanitize input
  req.query.city = city.replace(/[^a-zA-Z\s,]/g, '');
  logger.info(`Sanitized city parameter: ${req.query.city}`);
  next();
};

const validateQuery = (req, res, next) => {
  const query = req.query.query;
  if (!query || typeof query !== 'string' || query.length > 100) {
    logger.warn(`Invalid query parameter received: ${query}`);
    return res.status(400).json({ error: 'Invalid query parameter' });
  }
  // Sanitize input
  req.query.query = query.replace(/[^a-zA-Z\s,]/g, '');
  logger.info(`Sanitized query parameter: ${req.query.query}`);
  next();
};

// Health check endpoint
app.get('/', (req, res) => {
  logger.info('Health check endpoint accessed');
  res.json({ status: 'OK', message: 'Weather API is running' });
});

// Test endpoint
apiRouter.get('/test', (req, res) => {
  logger.info('Test endpoint accessed');
  res.json({ status: 'OK', message: 'Backend is reachable' });
});

// Weather endpoint with validation
apiRouter.get('/weather', validateCity, async (req, res) => {
  try {
    const { city } = req.query;
    logger.info(`Fetching weather data for city: ${city}`);

    const response = await axios.get(`${process.env.WEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric',
      },
      timeout: 5000
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

    logger.info(`Successfully fetched weather data for ${city}`);
    res.set('Cache-Control', 'public, max-age=300');
    res.json(weatherData);
  } catch (error) {
    logger.error('Error fetching weather data:', {
      error: error.message,
      city: req.query.city,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Cities endpoint with validation
apiRouter.get('/cities', validateQuery, async (req, res) => {
  try {
    const { query } = req.query;
    logger.info(`Searching cities with query: ${query}`);

    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5,
        appid: process.env.WEATHER_API_KEY,
      },
      timeout: 5000
    });

    const citySuggestions = response.data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
    }));

    logger.info(`Found ${citySuggestions.length} suggestions for query: ${query}`);
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(citySuggestions);
  } catch (error) {
    logger.error('Error fetching city suggestions:', {
      error: error.message,
      query: req.query.query,
      response: error.response?.data
    });
    res.status(500).json({ error: 'Failed to fetch city suggestions' });
  }
});

// Mount the API router
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  logger.info(`Server started at ${new Date().toISOString()}`);
}); 