import * as React from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
// Import profileService directly without destructuring
import profileService from '../services/profileService';

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Update profile photo if returning from camera
  const [profileImage, setProfileImage] = React.useState('https://randomuser.me/api/portraits/lego/1.jpg');
  
  React.useEffect(() => {
    if (params.photoUri) {
      setProfileImage(params.photoUri);
    }
  }, [params.photoUri]);
  
  // This would be replaced with actual user data from authentication
  const userProfile = {
    name: 'Alex Johnson',
    age: 29,
    bio: 'Adventure seeker and coffee enthusiast. Looking for someone to explore the city with!',
    interests: ['Travel', 'Coffee', 'Hiking', 'Photography'],
    image: profileImage
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Image 
          size={120} 
          source={{ uri: userProfile.image }} 
          style={styles.profileImage} 
        />
        <Text variant="headlineMedium" style={styles.name}>
          {userProfile.name}, {userProfile.age}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>About Me</Text>
        <Text variant="bodyMedium">{userProfile.bio}</Text>
      </View>
      
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {userProfile.interests.map(interest => (
            <View key={interest} style={styles.interestBadge}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          style={styles.cameraButton}
          icon="camera"
          onPress={() => router.push('/(modals)/camera')}
        >
          Change Photo
        </Button>
        
        <Button 
          mode="contained" 
          style={styles.editButton}
          icon="pencil"
          onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available in the next update!')}
        >
          Edit Profile
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    marginBottom: 16,
    backgroundColor: '#e1e1e1',
  },
  name: {
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestBadge: {
    backgroundColor: '#f6f0ff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  interestText: {
    color: '#a085e9',
  },
  buttonContainer: {
    marginTop: 8,
    flexDirection: 'column',
    gap: 12,
  },
  cameraButton: {
    backgroundColor: '#5c6bc0',
  },
  editButton: {
    backgroundColor: '#a085e9',
  },
});
