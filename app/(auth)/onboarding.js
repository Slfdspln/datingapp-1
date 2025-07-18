import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../utils/theme';
import Animated from 'react-native-reanimated';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  // References
  const scrollViewRef = useRef(null);
  
  // State variables
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    birthdate: '',
    gender: '',
    lookingFor: '',
    bio: '',
    interests: [],
    location: ''
  });

  // Function to handle profile submission
  const handleSubmitProfile = async () => {
    try {
      // Here you would typically save the profile data to your backend
      // For now, we'll just navigate to the main app
      await updateProfile(profileData);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Function to render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Welcome!</Text>
            <Text style={styles.stepDescription}>Let's start with your name</Text>
            <TextInput
              label="Your Name"
              value={profileData.name}
              onChangeText={(text) => setProfileData({...profileData, name: text})}
              style={styles.input}
              mode="outlined"
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>About You</Text>
            <TextInput
              label="Your Bio"
              value={profileData.bio}
              onChangeText={(text) => setProfileData({...profileData, bio: text})}
              style={styles.input}
              multiline
              numberOfLines={4}
              mode="outlined"
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your Location</Text>
            <TextInput
              label="Where are you located?"
              value={profileData.location}
              onChangeText={(text) => setProfileData({...profileData, location: text})}
              style={styles.input}
              mode="outlined"
            />
          </View>
        );
      default:
        return null;
    }
  };

  // Check if user can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return profileData.name.trim().length > 0;
      case 1:
        return profileData.bio.trim().length > 0;
      case 2:
        return profileData.location.trim().length > 0;
      default:
        return false;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitProfile();
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
      >
        {renderStep()}
        
        <View style={styles.navigation}>
          {currentStep > 0 && (
            <Button
              mode="outlined"
              onPress={handleBack}
              style={styles.backButton}
            >
              Back
            </Button>
          )}
          
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
            disabled={!canProceed()}
          >
            {currentStep < 2 ? 'Next' : 'Finish'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 2,
    backgroundColor: colors.primary,
  }
});
