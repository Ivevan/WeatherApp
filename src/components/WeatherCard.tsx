import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface WeatherCardProps {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  onPress?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  description,
  humidity,
  windSpeed,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.card}
      >
        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <Text style={styles.temperature}>{Math.round(temperature)}°C</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <Image
            source={{ uri: `http://openweathermap.org/img/wn/${icon}@2x.png` }}
            style={styles.icon}
          />
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{windSpeed} m/s</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    borderRadius: 20,
    overflow: 'hidden',
    width: width - 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    padding: 20,
    borderRadius: 20,
  },
  content: {
    alignItems: 'center',
  },
  mainInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  temperature: {
    fontSize: 56,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 20,
    color: '#ffffff',
    textTransform: 'capitalize',
    marginTop: 5,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  icon: {
    width: 120,
    height: 120,
    marginVertical: 15,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default WeatherCard; 