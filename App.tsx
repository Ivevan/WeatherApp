/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WeatherCard from './src/components/WeatherCard';
import SearchBar from './src/components/SearchBar';
import DetailedWeatherScreen from './src/screens/DetailedWeatherScreen';
import { getWeatherByCity, WeatherData, testBackendConnection } from './src/services/weatherService';

function App(): React.JSX.Element {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Test backend connection when app starts
  useEffect(() => {
    const checkBackendConnection = async () => {
      const isConnected = await testBackendConnection();
      setBackendConnected(isConnected);
      if (!isConnected) {
        Alert.alert(
          'Connection Error',
          'Cannot connect to the backend server. Please ensure the server is running.'
        );
      }
    };
    
    checkBackendConnection();
  }, []);

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // First check backend connection
      if (!backendConnected) {
        const isConnected = await testBackendConnection();
        setBackendConnected(isConnected);
        if (!isConnected) {
          throw new Error('Backend server is not reachable. Please ensure it is running.');
        }
      }
      
      const data = await getWeatherByCity(city);
      setWeatherData(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    handleSearch();
  };

  const handleViewToggle = () => {
    setShowDetailedView(!showDetailedView);
  };

  // If detailed view is active and we have weather data
  if (showDetailedView && weatherData) {
    return (
      <DetailedWeatherScreen 
        weatherData={weatherData}
        onBack={handleViewToggle}
      />
    );
  }

  return (
    <LinearGradient
      colors={['#f6f9fc', '#eef2f7']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <LinearGradient
              colors={['#4c669f', '#3b5998']}
              style={styles.headerGradient}
            >
              <Image
                source={{ uri: 'http://openweathermap.org/img/wn/01d@2x.png' }}
                style={styles.headerIcon}
              />
              <Text style={styles.title}>WeatherApp</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.searchContainer}>
            <SearchBar
              value={city}
              onChangeText={setCity}
              onSubmit={handleSearch}
              onSelectCity={handleCitySelect}
            />
            {backendConnected === false && (
              <View style={styles.connectionError}>
                <Text style={styles.connectionErrorText}>
                  ⚠️ Cannot connect to backend server
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.weatherContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4c669f" />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : weatherData ? (
              <WeatherCard
                temperature={weatherData.temperature}
                description={weatherData.description}
                humidity={weatherData.humidity}
                windSpeed={weatherData.windSpeed}
                icon={weatherData.icon}
                city={weatherData.city}
                country={weatherData.country}
                onPress={handleViewToggle}
              />
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    zIndex: 1000,
    elevation: 1000,
  },
  weatherContainer: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 20,
    zIndex: 1000,
    elevation: 1000,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  connectionError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff3b30',
    padding: 10,
    zIndex: 1001,
  },
  connectionErrorText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
