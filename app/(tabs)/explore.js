import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Badge, Button } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../utils/theme';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.45;

function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [vibes, setVibes] = useState([
    {
      id: 1,
      title: "Get Photo Verified",
      description: "Stand out with a verified badge",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3",
      gradient: ['#FF2D55', '#8A2BE2'],
      count: "16.1k",
      isCheckmark: true
    },
    {
      id: 2,
      title: "Looking for Love",
      description: "Find your perfect match",
      image: "https://images.unsplash.com/photo-1516195851053-7a8e7f300e9d?ixlib=rb-4.0.3",
      gradient: ['#FF9500', '#FF2D55'],
      count: "10.3k"
    },
    {
      id: 3,
      title: "Night Out",
      description: "Find someone for tonight",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3",
      gradient: ['#5AC8FA', '#007AFF'],
      count: "12.8k"
    },
    {
      id: 4,
      title: "Weekend Plans",
      description: "Find activities for the weekend",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3",
      gradient: ['#4CD964', '#5AC8FA'],
      count: "5.9k"
    }
  ]);

  const navigateToActivity = (activity) => {
    console.log('Navigate to activity:', activity);
    // Implementation based on activity type
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>DateMe</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#8A2BE2', '#FF69B4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3' }} 
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Let's Meet</Text>
              <Badge style={styles.heroBadge} size={24}>$$$</Badge>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>JOIN NOW</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Explore</Text>
          <Text style={styles.welcomeSubtitle}>My Vibe...</Text>
        </View>

        {/* Vibe cards */}
        <View style={styles.vibeCardsContainer}>
          {vibes.map((vibe, index) => (
            <TouchableOpacity 
              key={vibe.id} 
              style={styles.vibeCard}
              onPress={() => navigateToActivity(vibe)}
            >
              <LinearGradient
                colors={vibe.gradient}
                style={styles.vibeCardGradient}
              >
                <Image 
                  source={{ uri: vibe.image }} 
                  style={styles.vibeCardImage} 
                  resizeMode="cover"
                />
                <View style={styles.vibeCardContent}>
                  {vibe.isCheckmark && (
                    <View style={styles.verifiedBadge}>
                      <MaterialCommunityIcons name="check" size={14} color="#fff" />
                    </View>
                  )}
                  <View style={styles.countContainer}>
                    <Text style={styles.countText}>{vibe.count}</Text>
                  </View>
                  <Text style={styles.vibeCardTitle}>{vibe.title}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.replace('/')}>
          <Ionicons name="flame" size={28} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]} onPress={() => {}}>
          <Ionicons name="compass" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.replace('/matches')}>
          <MaterialCommunityIcons name="star-four-points" size={28} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.replace('/messages')}>
          <MaterialCommunityIcons name="message" size={28} color="#aaa" />
          <Badge style={styles.messageBadge}>3</Badge>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.replace('/profile')}>
          <Ionicons name="person" size={28} color="#aaa" />
        </TouchableOpacity>
      </View>
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
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4458',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 20,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    width: '100%',
    height: 220,
    marginBottom: 16,
  },
  heroBanner: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  heroBadge: {
    backgroundColor: '#FFD700',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
  joinButtonText: {
    fontWeight: 'bold',
  },
  welcomeSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  vibeCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  vibeCard: {
    width: cardWidth,
    height: 180,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  vibeCardGradient: {
    flex: 1,
    position: 'relative',
  },
  vibeCardImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  vibeCardContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0095ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vibeCardTitle: {
    position: 'absolute',
    bottom: 15,
    left: 12,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tabButton: {
    alignItems: 'center',
    padding: 8,
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4458',
  },
  messageBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF4458',
    fontSize: 10,
  },
});

// Export a React component as default for Expo Router
export default function ExploreTab() {
  return <ExploreScreen />;
}
