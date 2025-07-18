import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Switch, Chip } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import storage from '../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import AppLogo from '../../assets/app-logo';
import { colors } from '../utils/theme';

export default function DiscoverySettings() {
  const router = useRouter();
  const { user } = useAuth();
  const [minPhotos, setMinPhotos] = useState(2);
  const [hasBio, setHasBio] = useState(true);
  const [interests, setInterests] = useState(['Movies', 'Foodie Tour']);
  const [lookingFor, setLookingFor] = useState(['Long-term partner', 'New friends']);
  const [languages, setLanguages] = useState(['English']);
  const [zodiac, setZodiac] = useState(null);
  const [education, setEducation] = useState(null);
  const [familyPlans, setFamilyPlans] = useState(null);
  const [vaccine, setVaccine] = useState(null);
  const [personalityType, setPersonalityType] = useState(null);
  const [communicationStyle, setCommunicationStyle] = useState(['Picture texter', 'Phone calls']);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await storage.getDiscoverySettings();
        if (savedSettings) {
          setMinPhotos(savedSettings.minPhotos || 2);
          setHasBio(savedSettings.hasBio !== false);
          setInterests(savedSettings.interests || ['Movies', 'Foodie Tour']);
          setLookingFor(savedSettings.lookingFor || ['Long-term partner', 'New friends']);
          setLanguages(savedSettings.languages || ['English']);
          setZodiac(savedSettings.zodiac || null);
          setEducation(savedSettings.education || null);
          setFamilyPlans(savedSettings.familyPlans || null);
          setVaccine(savedSettings.vaccine || null);
          setPersonalityType(savedSettings.personalityType || null);
          setCommunicationStyle(savedSettings.communicationStyle || ['Picture texter', 'Phone calls']);
        }
      } catch (error) {
        console.error('Error loading discovery settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  const saveSettings = async () => {
    try {
      const settings = {
        minPhotos,
        hasBio,
        interests,
        lookingFor,
        languages,
        zodiac,
        education,
        familyPlans,
        vaccine,
        personalityType,
        communicationStyle
      };
      
      await storage.saveDiscoverySettings(settings);
      router.back();
    } catch (error) {
      console.error('Error saving discovery settings:', error);
    }
  };

  const navigateToOptions = (option) => {
    // In a real app, navigate to a specific selection screen
    console.log(`Navigate to ${option} options`);
    
    if (option === 'languages') {
      router.push('/(modals)/language-select');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discovery Settings</Text>
        <TouchableOpacity onPress={saveSettings}>
          <LinearGradient
            colors={['#FF7B69', '#FF4458']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneButton}
          >
            <Text style={styles.doneButtonText}>SAVE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['rgba(255, 75, 85, 0.2)', 'rgba(255, 75, 85, 0.05)']}
          style={styles.premiumSection}
        >
          <View style={styles.premiumHeader}>
            <Text style={styles.premiumTitle}>PREMIUM DISCOVERY</Text>
            <LinearGradient
              colors={['#FF7B69', '#FF4458']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBadge}
            >
              <Text style={styles.premiumBadgeText}>Flame Platinum</Text>
            </LinearGradient>
          </View>
          <Text style={styles.premiumDescription}>
            Preferences show you people who match your vibe, but won't limit who you see — you'll still be able to match with people outside of your selections.
          </Text>
        </LinearGradient>
        
        <View style={styles.settingSection}>
          <Text style={styles.settingTitle}>Minimum number of photos</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={6}
              step={1}
              value={minPhotos}
              onValueChange={setMinPhotos}
              minimumTrackTintColor="#FF4458"
              maximumTrackTintColor="#D8D8D8"
              thumbTintColor="#FF4458"
            />
            <Text style={styles.sliderValue}>{minPhotos}</Text>
          </View>
        </View>
        
        <View style={styles.switchSettingSection}>
          <Text style={styles.settingTitle}>Has a bio</Text>
          <Switch
            value={hasBio}
            onValueChange={setHasBio}
            color="#FF4458"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigateToOptions('interests')}
        >
          <Text style={styles.settingTitle}>Interests</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {interests.length > 0 ? interests.join(', ') : 'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigateToOptions('lookingFor')}
        >
          <View style={styles.settingWithIcon}>
            <Ionicons name="eye-outline" size={24} color="#000" style={styles.settingIcon} />
            <Text style={styles.settingTitle}>Looking for</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText} numberOfLines={1}>
              {lookingFor.length > 0 ? lookingFor.join(', ') : 'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigateToOptions('languages')}
        >
          <View style={styles.settingWithIcon}>
            <MaterialCommunityIcons name="translate" size={24} color="#000" style={styles.settingIcon} />
            <Text style={styles.settingTitle}>Add languages</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {languages.length > 0 ? languages.join(', ') : 'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigateToOptions('zodiac')}
        >
          <View style={styles.settingWithIcon}>
            <Ionicons name="moon-outline" size={24} color="#000" style={styles.settingIcon} />
            <Text style={styles.settingTitle}>Zodiac</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {zodiac || 'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigateToOptions('education')}
        >
          <View style={styles.settingWithIcon}>
            <Ionicons name="school-outline" size={24} color="#000" style={styles.settingIcon} />
            <Text style={styles.settingTitle}>Education</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {education || 'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigateToOptions('familyPlans')}
        >
          <View style={styles.settingWithIcon}>
            <Ionicons name="people-outline" size={24} color="#000" style={styles.settingIcon} />
            <Text style={styles.settingTitle}>Family Plans</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {familyPlans || 'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigateToOptions('vaccine')}
        >
          <View style={styles.settingWithIcon}>
            <Ionicons name="medical-outline" size={24} color="#000" style={styles.settingIcon} />
            <Text style={styles.settingTitle}>COVID Vaccine</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {vaccine || 'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigateToOptions('personalityType')}
        >
          <View style={styles.settingWithIcon}>
            <Ionicons name="happy-outline" size={24} color="#000" style={styles.settingIcon} />
            <Text style={styles.settingTitle}>Personality Type</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {personalityType || 'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingRow, styles.lastSetting]}
          onPress={() => navigateToOptions('communicationStyle')}
        >
          <View style={styles.settingWithIcon}>
            <Ionicons name="chatbubble-outline" size={24} color="#000" style={styles.settingIcon} />
            <Text style={styles.settingTitle}>Communication Style</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText} numberOfLines={1}>
              {communicationStyle.length > 0 ? 
                (communicationStyle.join(', ').length > 20 ? 
                  communicationStyle.join(', ').substring(0, 20) + '...' : 
                  communicationStyle.join(', ')) : 
                'Select'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  doneButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  premiumSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 85, 0.3)',
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4458',
  },
  premiumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  premiumBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  settingSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  switchSettingSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  slider: {
    flex: 1,
    height: 40,
    marginRight: 8,
  },
  sliderValue: {
    width: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    color: '#8E8E93',
    marginRight: 8,
    maxWidth: 150,
  },
  lastSetting: {
    marginBottom: 32,
  }
});
