import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CitySuggestion, getCitySuggestions } from '../services/weatherService';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  onSelectCity?: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Enter city name',
  onSelectCity,
}) => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.trim().length >= 2) {
        const citySuggestions = await getCitySuggestions(value);
        setSuggestions(citySuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSelectCity = (city: CitySuggestion) => {
    const fullCityName = city.state 
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;
    
    onChangeText(fullCityName);
    setShowSuggestions(false);
    if (onSelectCity) {
      onSelectCity(fullCityName);
    }
  };

  const generateUniqueKey = (item: CitySuggestion, index: number) => {
    return `${item.name}-${item.country}-${item.state || ''}-${index}`;
  };

  const renderSuggestion = ({ item, index }: { item: CitySuggestion; index: number }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectCity(item)}
    >
      <Text style={styles.suggestionText}>
        {item.name}
        {item.state ? `, ${item.state}` : ''}
        {`, ${item.country}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.gradient}
        >
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#666"
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
            <LinearGradient
              colors={['#4c669f', '#3b5998']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Search</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={generateUniqueKey}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    width: '100%',
    zIndex: 1000,
    elevation: 1000,
  },
  container: {
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    width: width - 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  gradient: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 13,
    borderBottomLeftRadius: 13,
  },
  buttonContainer: {
    overflow: 'hidden',
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
  },
  button: {
    paddingHorizontal: 25,
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1000,
    maxHeight: 200,
    zIndex: 1000,
  },
  suggestionsList: {
    borderRadius: 15,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar; 