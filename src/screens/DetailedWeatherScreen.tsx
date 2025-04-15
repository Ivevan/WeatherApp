import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  SafeAreaView,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface DetailedWeatherScreenProps {
  weatherData: {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    city: string;
    country: string;
  };
  onBack: () => void;
}

const DetailedWeatherScreen: React.FC<DetailedWeatherScreenProps> = ({
  weatherData,
  onBack,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Get time of day to adjust gradient colors
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;
  
  // Updated gradient colors to match the screenshot (dark blue shades)
  const gradientColors = ['#0f2027', '#203a43', '#2c5364'];
    
  // Mock data for forecast and additional info
  const forecastData = [
    { day: 'Tomorrow', temp: Math.round(weatherData.temperature + Math.random() * 5 - 2), icon: weatherData.icon },
    { day: 'Wednesday', temp: 24, icon: '01d' },
    { day: 'Thursday', temp: 24, icon: '03d' },
    { day: 'Friday', temp: 21, icon: '10d' },
    { day: 'Saturday', temp: 22, icon: '02d' },
  ];
  
  const additionalInfo = [
    { title: 'Feels Like', value: `24°C` },
    { title: 'UV Index', value: 'Moderate' },
    { title: 'Visibility', value: '10 km' },
    { title: 'Pressure', value: '1015 hPa' },
    { title: 'Sunrise', value: '6:23 AM' },
    { title: 'Sunset', value: '6:45 PM' },
  ];

  // Rotating wind icon animation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    // Initial animation sequence
    Animated.stagger(100, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
    
    // Continuous pulse animation for the temperature
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
    
    // Continuous rotation for the wind icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  // For hours forecast - simplified to match screenshot
  const hourlyForecast = [
    { time: 'Now', temp: Math.round(weatherData.temperature), icon: weatherData.icon },
    { time: '9 PM', temp: 23, icon: '01n' },
    { time: '12 AM', temp: 22, icon: '01n' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={gradientColors}
        style={styles.background}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Detailed Forecast</Text>
          </View>
          
          <Animated.View 
            style={[
              styles.mainCard, 
              { 
                opacity: fadeAnim, 
                transform: [
                  { translateY: slideAnim },
                  { scale: fadeAnim }
                ] 
              }
            ]}
          >
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                {weatherData.city}, {weatherData.country}
              </Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            
            <View style={styles.weatherInfoMain}>
              <View style={styles.tempContainer}>
                <Animated.Text 
                  style={[
                    styles.tempText,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  {Math.round(weatherData.temperature)}°
                </Animated.Text>
                <Text style={styles.descriptionText}>
                  {weatherData.description}
                </Text>
              </View>
              
              <Image
                source={{ uri: `http://openweathermap.org/img/wn/${weatherData.icon}@4x.png` }}
                style={styles.weatherIcon}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>💧</Text>
                </View>
                <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
                <Text style={styles.detailLabel}>Humidity</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Animated.View 
                  style={[
                    styles.iconContainer,
                    { transform: [{ rotate: spin }] }
                  ]}
                >
                  <Text style={styles.iconText}>💨</Text>
                </Animated.View>
                <Text style={styles.detailValue}>{weatherData.windSpeed} m/s</Text>
                <Text style={styles.detailLabel}>Wind</Text>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>📊</Text>
                </View>
                <Text style={styles.detailValue}>1015</Text>
                <Text style={styles.detailLabel}>Pressure</Text>
              </View>
            </View>
          </Animated.View>
          
          {/* Hourly Forecast */}
          <Animated.View 
            style={[
              styles.forecastContainer, 
              { 
                opacity: fadeAnim, 
                transform: [
                  { translateY: slideAnim },
                  { scale: fadeAnim }
                ] 
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            <View style={styles.hourlyRowContainer}>
              {hourlyForecast.map((hour, index) => (
                <Animated.View 
                  key={index} 
                  style={[
                    styles.hourItem,
                    { 
                      opacity: fadeAnim,
                      transform: [
                        { translateY: Animated.multiply(slideAnim, new Animated.Value(1 + index * 0.3)) }
                      ] 
                    }
                  ]}
                >
                  <Text style={styles.hourTime}>{hour.time}</Text>
                  <Image
                    source={{ uri: `http://openweathermap.org/img/wn/${hour.icon}@2x.png` }}
                    style={styles.hourIcon}
                  />
                  <Text style={styles.hourTemp}>{hour.temp}°</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
          
          {/* 5-Day Forecast */}
          <Animated.View 
            style={[
              styles.forecastContainer, 
              { 
                opacity: fadeAnim, 
                transform: [
                  { translateY: slideAnim },
                  { scale: fadeAnim }
                ] 
              }
            ]}
          >
            <Text style={styles.sectionTitle}>5-Day Forecast</Text>
            {forecastData.slice(1).map((day, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.dayForecast,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateX: Animated.multiply(slideAnim, new Animated.Value((index % 2 === 0 ? 1 : -1) * 0.3)) }
                    ]
                  }
                ]}
              >
                <Text style={styles.dayName}>{day.day}</Text>
                <Image
                  source={{ uri: `http://openweathermap.org/img/wn/${day.icon}@2x.png` }}
                  style={styles.dayIcon}
                />
                <Text style={styles.dayTemp}>{day.temp}°</Text>
              </Animated.View>
            ))}
          </Animated.View>
          
          {/* Additional Weather Details */}
          <Animated.View 
            style={[
              styles.additionalContainer, 
              { 
                opacity: fadeAnim, 
                transform: [
                  { translateY: slideAnim },
                  { scale: fadeAnim }
                ] 
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Weather Details</Text>
            <View style={styles.additionalGrid}>
              {additionalInfo.map((info, index) => (
                <Animated.View 
                  key={index} 
                  style={[
                    styles.additionalItem,
                    {
                      opacity: fadeAnim,
                      transform: [
                        { translateY: Animated.multiply(slideAnim, new Animated.Value(1 + index * 0.2)) }
                      ]
                    }
                  ]}
                >
                  <Text style={styles.additionalTitle}>{info.title}</Text>
                  <Text style={styles.additionalValue}>{info.value}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  mainCard: {
    margin: 15,
    padding: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  weatherInfoMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempContainer: {
    flex: 1,
  },
  tempText: {
    color: '#fff',
    fontSize: 70,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textTransform: 'capitalize',
    marginTop: -5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  detailItem: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconText: {
    fontSize: 20,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  forecastContainer: {
    margin: 15,
    padding: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hourlyRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: (width - 110) / 3,
  },
  hourTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  hourIcon: {
    width: 50,
    height: 50,
  },
  hourTemp: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayForecast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayName: {
    color: '#fff',
    fontSize: 16,
    width: 100,
  },
  dayIcon: {
    width: 40,
    height: 40,
  },
  dayTemp: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalContainer: {
    margin: 15,
    padding: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  additionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  additionalItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  additionalTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  additionalValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default DetailedWeatherScreen; 