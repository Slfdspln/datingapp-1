import * as React from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Text, Button, IconButton, Badge, LinearProgress } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileViewScreen() {
  const router = useRouter();
  const { profile } = useLocalSearchParams();
  
  // Parse the profile data from the URL params
  const profileData = profile ? JSON.parse(profile) : null;
  // Profile completion percentage (10% to 100%)
  const profileCompletion = profileData?.completion || 10;
  
  if (!profileData) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={{color: '#fff'}}>Profile not found</Text>
        <Button textColor="#FF4458" onPress={() => router.back()}>Go Back</Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* App Header with back button and Icons */}
        <View style={styles.appHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconButton}>
              <Ionicons name="shield" size={24} color="#8E8E8E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <Ionicons name="settings-outline" size={24} color="#8E8E8E" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.profileImageContainer}>
          {profileData.image ? (
            <Image 
              source={{ uri: profileData.image }} 
              style={styles.profileImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.profileImage, styles.noImageContainer]}>
              <Text style={styles.noImageText}>{profileData.name ? profileData.name[0].toUpperCase() : '?'}</Text>
            </View>
          )}
          
          {/* Profile Completion Indicator */}
          <View style={styles.completionContainer}>
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>{profileCompletion}% COMPLETE</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.profileContent}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {profileData.name}, {profileData.age || 29}
            </Text>
            {(profileData.verified || true) && (
              <Ionicons name="checkmark-circle" size={24} color="#00aff0" style={{marginLeft: 4}} />
            )}
          </View>
          
          {/* Feature Cards Section */}
          <View style={styles.featureCardsContainer}>
            <View style={styles.featureCard}>
              <Ionicons name="star" size={28} color="#00B8FF" style={styles.featureIcon} />
              <Text style={styles.featureLabel}>Super Likes</Text>
              <Text style={styles.featureValue}>{profileData.superLikes || 9}</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Ionicons name="flash" size={28} color="#8A2BE2" style={styles.featureIcon} />
              <Text style={styles.featureLabel}>My Boosts</Text>
              <Text style={styles.featureValue}>{profileData.boostTime || '04:43'}</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Ionicons name="flame" size={28} color="#FFD700" style={styles.featureIcon} />
              <Text style={styles.featureLabel}>Premium</Text>
              <Text style={styles.featureValue}>Upgrade</Text>
            </View>
          </View>
          
          {/* Premium Membership Section */}
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <View style={styles.premiumLogo}>
                <Ionicons name="flame" size={22} color="#222" />
                <Text style={styles.premiumText}>PLATINUM</Text>
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.premiumTitle}>What's Included</Text>
            
            <View style={styles.premiumFeaturesContainer}>
              <View style={styles.featureRow}>
                <Text style={styles.featureText}>Priority Likes</Text>
                <View style={styles.tierContainer}>
                  <Text style={styles.tierNotIncluded}>—</Text>
                  <Text style={styles.tierIncluded}>✓</Text>
                </View>
              </View>
              
              <View style={styles.featureRow}>
                <Text style={styles.featureText}>Message before Matching</Text>
                <View style={styles.tierContainer}>
                  <Text style={styles.tierNotIncluded}>—</Text>
                  <Text style={styles.tierIncluded}>✓</Text>
                </View>
              </View>
              
              <View style={styles.featureRow}>
                <Text style={styles.featureText}>See Who Likes You</Text>
                <View style={styles.tierContainer}>
                  <Text style={styles.tierIncluded}>✓</Text>
                  <Text style={styles.tierIncluded}>✓</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All Features</Text>
            </TouchableOpacity>
          </View>
          
          {/* About Me Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About me</Text>
            </View>
            <Text style={styles.bioText}>{profileData.bio || 'No bio available'}</Text>
          </View>
          
          <View style={styles.preferenceSection}>
            <Text style={styles.sectionTitle}>PREMIUM DISCOVERY</Text>
            <View style={styles.discoveryRow}>
              <View style={styles.discoveryInfo}>
                <View style={styles.goldBadge}>
                  <Text style={styles.goldBadgeText}>GOLD</Text>
                </View>
                <Text style={styles.discoveryText}>
                  Preferences show you people who match your vibe,
                  but won't limit who you see.
                </Text>
              </View>
            </View>
            
            {/* Preferences Section */}
            <View style={styles.preferenceSetting}>
              <Text style={styles.preferenceLabel}>Minimum number of photos</Text>
              <Text style={styles.preferenceValue}>2</Text>
            </View>
            <View style={styles.sliderContainer}>
              <View style={styles.slider}>
                <View style={styles.sliderFill} />
                <View style={styles.sliderThumb} />
              </View>
            </View>
            
            <View style={styles.preferenceSetting}>
              <Text style={styles.preferenceLabel}>Has a bio</Text>
              <View style={styles.toggle}>
                <View style={styles.toggleOn} />
              </View>
            </View>
            
            <View style={styles.preferenceSetting}>
              <Text style={styles.preferenceLabel}>Interests</Text>
              <Text style={styles.interestValue}>Movies, Foodie Tour</Text>
            </View>
          </View>
          
          {/* Badges Section - Inspired by Reference Image 4 */}
          <View style={styles.badgesSection}>
            {/* Active Badge */}
            <View style={styles.badgeRow}>
              <View style={styles.activeBadge}>
                <Text style={styles.badgeText}>Recently Active</Text>
              </View>
            </View>
            
            {/* Matched Preferences */}
            <View style={styles.matchesContainer}>
              <Text style={styles.matchesText}>Matched 5+ Preferences</Text>
            </View>
            
            {/* Preference Badges */}
            <View style={styles.badgesContainer}>
              {['English', 'Time together', 'Non-smoker', 'Has Bio'].map((badge, index) => (
                <View key={index} style={styles.preferenceBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#a9a9a9" style={{marginRight: 4}} />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
            
            {/* User's Interests */}
            {profileData.interests && profileData.interests.length > 0 && (
              <View style={styles.interestsContainer}>
                {profileData.interests.map((interest, index) => (
                  <View key={index} style={styles.interestBadge}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="flame" size={28} color="#FF6B6B" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="search" size={28} color="#8E8E8E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="star" size={28} color="#8E8E8E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="chatbubbles" size={28} color="#8E8E8E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton} onPress={() => router.back()}>
          <Ionicons name="person" size={28} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
      
      {/* Action Button (NOPE button from image 4) */}
      <TouchableOpacity 
        style={styles.nopeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: '#000',
    flex: 1,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    marginLeft: 20,
    padding: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: 480,
    borderRadius: 8,
  },
  noImageContainer: {
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#fff',
  },
  completionContainer: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  completionBadge: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  completionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileContent: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  featureCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  featureIcon: {
    marginBottom: 4,
  },
  featureLabel: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  featureValue: {
    color: '#fff',
    fontWeight: 'bold',
  },
  premiumCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  premiumText: {
    fontWeight: 'bold',
    marginLeft: 4,
  },
  upgradeButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  upgradeText: {
    color: '#fff',
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  premiumFeaturesContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    color: '#fff',
    flex: 1,
  },
  tierContainer: {
    flexDirection: 'row',
    width: 80,
    justifyContent: 'space-around',
  },
  tierIncluded: {
    color: '#00aff0',
    fontWeight: 'bold',
  },
  tierNotIncluded: {
    color: '#666',
  },
  seeAllButton: {
    alignItems: 'center',
  },
  seeAllText: {
    color: '#00aff0',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  bioText: {
    color: '#ddd',
    lineHeight: 22,
  },
  preferenceSection: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  discoveryRow: {
    marginVertical: 10,
  },
  discoveryInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  goldBadge: {
    backgroundColor: '#FFD700',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  goldBadgeText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
  },
  discoveryText: {
    color: '#ddd',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  preferenceSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  preferenceLabel: {
    color: '#fff',
  },
  preferenceValue: {
    color: '#aaa',
  },
  interestValue: {
    color: '#aaa',
  },
  sliderContainer: {
    marginVertical: 5,
  },
  slider: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    width: '40%',
    height: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    left: '40%',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  toggle: {
    width: 50,
    height: 28,
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  badgesSection: {
    padding: 10,
    marginBottom: 16,
  },
  badgeRow: {
    marginBottom: 10,
  },
  activeBadge: {
    backgroundColor: 'rgba(0, 200, 80, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
  },
  matchesContainer: {
    marginVertical: 10,
  },
  matchesText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  preferenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120, 120, 120, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 4,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  interestBadge: {
    backgroundColor: 'rgba(120, 120, 120, 0.3)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
  },
  interestText: {
    color: '#fff',
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
  },
  nopeButton: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    backgroundColor: '#FF4458',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FF4458',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
