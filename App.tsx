/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
} from 'react-native';
import WeatherCard from './src/components/WeatherCard';
import SearchBar from './src/components/SearchBar';
import { getWeatherByCity, WeatherData } from './src/services/weatherService';

function App(): React.JSX.Element {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(city);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'http://openweathermap.org/img/wn/01d@2x.png' }}
            style={styles.headerIcon}
          />
          <Text style={styles.title}>WeatherApp</Text>
        </View>
        <SearchBar
          value={city}
          onChangeText={setCity}
          onSubmit={handleSearch}
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : weatherData ? (
          <WeatherCard
            temperature={weatherData.temperature}
            description={weatherData.description}
            humidity={weatherData.humidity}
            windSpeed={weatherData.windSpeed}
            icon={weatherData.icon}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
