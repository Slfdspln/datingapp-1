import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const LANGUAGES = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'ASL',
  'Assamese', 'Aymara', 'Azerbaijani', 'Bambara', 'Basque', 'Belarusian',
  'Bengali', 'Bhojpuri', 'Bosnian', 'Breton', 'Bulgarian', 'Burmese',
  'Cantonese', 'Catalan', 'Cebuano', 'Chichewa', 'Corsican', 'Croatian',
  'Czech', 'Danish', 'Dhivehi', 'Dogri', 'Dutch', 'English', 'Esperanto',
  'Estonian', 'Ewe', 'Filipino', 'Finnish', 'French', 'Frisian', 'Galician',
  'Georgian', 'German', 'Greek', 'Guarani', 'Gujarati', 'Haitian Creole',
  'Hausa', 'Hawaiian', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian',
  'Icelandic', 'Igbo', 'Ilocano'
];

export default function LanguageSelectScreen() {
  const router = useRouter();
  const [selectedLanguages, setSelectedLanguages] = useState(['English']);
  
  useEffect(() => {
    const loadSelectedLanguages = async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedLanguages');
        if (saved) {
          setSelectedLanguages(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading languages:', error);
      }
    };
    
    loadSelectedLanguages();
  }, []);
  
  const toggleLanguage = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };
  
  const saveLanguages = async () => {
    try {
      await AsyncStorage.setItem('selectedLanguages', JSON.stringify(selectedLanguages));
      router.back();
    } catch (error) {
      console.error('Error saving languages:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerLine} />
          <Text style={styles.headerTitle}>Add languages</Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.languagesList}>
        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language}
            style={[
              styles.languageButton,
              selectedLanguages.includes(language) && styles.selectedLanguage
            ]}
            onPress={() => toggleLanguage(language)}
          >
            <Text 
              style={[
                styles.languageText,
                selectedLanguages.includes(language) && styles.selectedLanguageText
              ]}
            >
              {language}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.doneButton}
        onPress={saveLanguages}
      >
        <LinearGradient
          colors={['#FF7B69', '#FF4458']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.doneGradient}
        >
          <Text style={styles.doneText}>DONE</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 10,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerLine: {
    width: 36,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    margin: 5,
  },
  languageText: {
    fontSize: 16,
    color: '#000',
  },
  selectedLanguage: {
    borderColor: '#FF4458',
    backgroundColor: 'rgba(255, 68, 88, 0.1)',
  },
  selectedLanguageText: {
    color: '#FF4458',
  },
  doneButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 48,
    borderRadius: 25,
    overflow: 'hidden',
  },
  doneGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
