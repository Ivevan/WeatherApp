# Dockerized WeatherApp Backend

This document explains how to build and run the WeatherApp backend using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Building and Running with Docker

### Option 1: Using Docker Directly

1. Build the Docker image:
```bash
docker build -t weather-app-backend .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env -d --name weather-backend weather-app-backend
```

3. Check if the container is running:
```bash
docker ps
```

4. View logs:
```bash
docker logs weather-backend
```

5. Stop the container:
```bash
docker stop weather-backend
```

### Option 2: Using Docker Compose (Recommended)

1. Start the service:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f
```

3. Stop the service:
```bash
docker-compose down
```

## Environment Variables

Make sure your `.env` file contains:
```
PORT=3000
WEATHER_API_KEY=your_api_key
WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

## Accessing the API

The API will be available at:
- From your machine: http://localhost:3000
- From other containers: http://weather-backend:3000
- Health check: http://localhost:3000/health 