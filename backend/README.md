# WeatherApp Backend

This is a Node.js backend for the WeatherApp that securely handles API requests to the OpenWeatherMap API.

## Features

- Secure API key handling
- Weather data retrieval
- City suggestions for search
- CORS support
- Environment variable configuration

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   WEATHER_API_KEY=your_openweathermap_api_key
   WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
   ```

3. Start the server:
   - For development (with auto-reload):
     ```
     npm run dev
     ```
   - For production:
     ```
     npm start
     ```

## API Endpoints

### GET /api/weather
Get weather data for a specific city.

Query parameters:
- `city`: Name of the city (required)

Response:
```json
{
  "temperature": 25.5,
  "description": "clear sky",
  "humidity": 60,
  "windSpeed": 5.2,
  "icon": "01d",
  "city": "New York",
  "country": "US"
}
```

### GET /api/cities
Get city suggestions based on a search query.

Query parameters:
- `query`: Search term (required)

Response:
```json
[
  {
    "name": "New York",
    "country": "US",
    "state": "New York"
  },
  {
    "name": "Newark",
    "country": "US",
    "state": "New Jersey"
  }
]
```

### GET /health
Health check endpoint to verify if the server is running.

Response:
```json
{
  "status": "UP"
}
``` 