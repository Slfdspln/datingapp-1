import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Chip, TextInput } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated from 'react-native-reanimated';
import { useButtonAnimation, useModalAnimation } from '../utils/animations';
import storage from '../utils/storage';
import i18n from '../utils/i18n';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profileService';
import { colors } from '../utils/theme';

// Fallback colors in case theme import fails during initial load
const fallbackColors = {
  textSecondary: '#757575',
  primary: '#a085e9',
  error: '#ff5252'
};
import EmptySwipeState from '../components/EmptySwipeState';
import AppLogo from '../../assets/app-logo';

function HomeScreen() {
  const router = useRouter();
  const swiperRef = useRef(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [distance, setDistance] = useState(25);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const { overlayStyle, modalStyle, showModal, hideModal } = useModalAnimation();
  const likeButtonAnimation = useButtonAnimation();
  const passButtonAnimation = useButtonAnimation();
  const filterButtonAnimation = useButtonAnimation();
  
  // Function to render profile card
  const renderCard = (user) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: user.image }} style={styles.cardImage} />
        
        <View style={styles.cardDetails}>
          <Text style={styles.cardName}>{user.name}, {user.age}</Text>
          
          <View style={styles.cardDistance}>
            <Ionicons name="location-outline" size={16} color={(colors || fallbackColors).textSecondary} />
            <Text style={styles.cardDistanceText}>{user.distance} miles away</Text>
          </View>
          
          {user.bio && (
            <Text numberOfLines={3} style={styles.cardBio}>{user.bio}</Text>
          )}
          
          <View style={styles.interestTags}>
            {user.interests?.slice(0, 3).map((interest, index) => (
              <Chip key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </Chip>
            ))}
            {user.interests?.length > 3 && (
              <Chip style={styles.interestChip}>
                <Text style={styles.interestText}>+{user.interests.length - 3}</Text>
              </Chip>
            )}
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    const loadFilterSettings = async () => {
      const savedFilters = await storage.getFilterSettings();
      if (savedFilters) {
        setAgeRange(savedFilters.ageRange || [18, 35]);
        setDistance(savedFilters.distance || 25);
        setSelectedInterests(savedFilters.interests || []);
      }
    };

    loadFilterSettings();
  }, []);

  const handleAgeMin = (val) => {
    const newVal = parseInt(val) || 18;
    setAgeRange([newVal, ageRange[1]]);
  };

  const handleAgeMax = (val) => {
    const newVal = parseInt(val) || 35;
    setAgeRange([ageRange[0], newVal]);
  };

  const handleDistance = (val) => {
    const newVal = parseInt(val) || 25;
    setDistance(newVal);
  };

  const allInterests = ['Hiking', 'Music', 'Travel', 'Food', 'Art', 'Sports', 'Reading', 'Gaming', 'Movies', 'Fitness'];
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch potential matches from Supabase
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const filters = {
          minAge: ageRange[0],
          maxAge: ageRange[1],
          interests: selectedInterests
        };
        
        const { matches, error } = await profileService.getPotentialMatches(user.id, filters);
        
        if (error) throw error;
        
        if (matches && matches.length > 0) {
          // Transform the data to match our UI expectations
          const formattedMatches = matches.map(profile => ({
            id: profile.id,
            name: profile.name,
            age: profile.age,
            distance: 10, // This would be calculated based on location in a real app
            bio: profile.bio || '',
            interests: profile.interests || [],
            image: profile.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg'
          }));
          
          setUsers(formattedMatches);
        } else {
          setUsers([{ isFallback: true, name: 'No matches', bio: 'Try adjusting your filters' }]);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles');
        setUsers([{ isFallback: true, name: 'Error', bio: 'Something went wrong. Please try again.' }]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, [user]);

  const applyFilters = async () => {
    // Save filter settings to AsyncStorage
    await storage.saveFilterSettings({
      ageRange,
      distance,
      interests: selectedInterests
    });
    
    // Hide modal first for better UX
    hideModal(() => setFilterVisible(false));
    
    // Then fetch profiles with new filters
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const filters = {
        minAge: ageRange[0],
        maxAge: ageRange[1],
        interests: selectedInterests
      };
      
      const { matches, error } = await profileService.getPotentialMatches(user.id, filters);
      
      if (error) throw error;
      
      if (matches && matches.length > 0) {
        // Transform the data to match our UI expectations
        const formattedMatches = matches.map(profile => ({
          id: profile.id,
          name: profile.name,
          age: profile.age,
          distance: 10, // This would be calculated based on location in a real app
          bio: profile.bio || '',
          interests: profile.interests || [],
          image: profile.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg'
        }));
        
        setUsers(formattedMatches);
      } else {
        setUsers([{ isFallback: true, name: 'No matches', bio: 'Try adjusting your filters' }]);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles');
      setUsers([{ isFallback: true, name: 'Error', bio: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
      setCardIndex(0);
    }
  };

  const onSwiped = (idx, direction) => {
    const currentUser = users[idx];
    
    // Don't process swipes on fallback cards
    if (currentUser && !currentUser.isFallback && user) {
      // Record like or pass in Supabase
      if (direction === 'right') {
        handleLike(currentUser.id);
      } else if (direction === 'left') {
        handlePass(currentUser.id);
      }
    }
    
    // Update card index
    if (idx === users.length - 1) {
      // Refresh profiles when we reach the end
      applyFilters();
    } else {
      setCardIndex(idx + 1);
    }
  };
  
  const handleLike = async (likedUserId) => {
    if (!user || !likedUserId) return;
    
    try {
      const { isMatch, error } = await profileService.likeProfile(user.id, likedUserId);
      
      if (error) {
        console.error('Error liking profile:', error);
        return;
      }
      
      // Show match notification if it's a match
      if (isMatch) {
        // In a real app, you would show a match modal here
        alert('It\'s a match! 🎉');
      }
    } catch (err) {
      console.error('Error processing like:', err);
    }
  };
  
  const handlePass = async (passedUserId) => {
    if (!user || !passedUserId) return;
    
    try {
      const { success, error } = await profileService.passProfile(user.id, passedUserId);
      
      if (error) {
        console.error('Error passing profile:', error);
      }
    } catch (err) {
      console.error('Error processing pass:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {users.length === 0 && !loading ? (
        <EmptySwipeState onRefresh={() => applyFilters()} />
      ) : (
        <>
          <View style={styles.filterRow}>
            <Text variant="titleLarge">{i18n.t('discover')}</Text>
            <Animated.View style={filterButtonAnimation.animatedStyles}>
              <Button 
                icon="tune" 
                mode="outlined" 
                onPress={() => {
                  setFilterVisible(true);
                  showModal();
                }}
                onPressIn={filterButtonAnimation.onPressIn}
                onPressOut={filterButtonAnimation.onPressOut}
              >
                {i18n.t('filters')}
              </Button>
            </Animated.View>
          </View>
          
          <View style={styles.swiperContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={(colors || fallbackColors).primary} />
                <Text style={styles.loadingText}>Loading profiles...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Button mode="contained" onPress={applyFilters}>Retry</Button>
              </View>
            ) : (
              <Swiper
                ref={swiperRef}
                cards={users}
                cardIndex={cardIndex}
                infinite={false}
                onSwipedLeft={(index) => onSwiped(index, 'left')}
                onSwipedRight={(idx) => {
                  onSwiped(idx, 'right');
                  router.push({
                    pathname: '/(modals)/profile-view',
                    params: { profile: JSON.stringify(users[idx]) }
                  });
                }}
                renderCard={(user) => {
                  if (!user || user.isFallback) {
                    return (
                      <View style={[styles.card, { justifyContent: 'center' }]}>
                        <Text style={{ textAlign: 'center', color: '#888' }}>{i18n.t('noMatches')}</Text>
                      </View>
                    );
                  }
                  return renderCard(user);
                }}
                disableTopSwipe
                disableBottomSwipe
                backgroundColor={'transparent'}
                stackSize={3}
                stackSeparation={15}
                overlayLabels={{
                  left: {
                    title: 'PASS',
                    style: {
                      label: {
                        backgroundColor: '#E53935',
                        color: 'white',
                        fontSize: 24
                      },
                      wrapper: {
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        marginTop: 30,
                        marginLeft: -30
                      }
                    }
                  },
                  right: {
                    title: 'LIKE',
                    style: {
                      label: {
                        backgroundColor: '#43A047',
                        color: 'white',
                        fontSize: 24
                      },
                      wrapper: {
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        marginTop: 30,
                        marginLeft: 30
                      }
                    }
                  }
                }}
              />
            )}
          </View>
          
          {/* Action Buttons */}
          {!loading && !error && users.length > 0 && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.smallActionButton} 
                onPress={() => swiperRef.current?.swipeBack()}
              >
                <Ionicons name="refresh" size={24} color="#FFCA28" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => swiperRef.current?.swipeLeft()}
                onPressIn={passButtonAnimation.onPressIn}
                onPressOut={passButtonAnimation.onPressOut}
              >
                <Ionicons name="close" size={34} color="#FF4458" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.smallActionButton}
                onPress={() => alert('Super Like!')}
              >
                <Ionicons name="star" size={24} color="#00aff0" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => swiperRef.current?.swipeRight()}
                onPressIn={likeButtonAnimation.onPressIn}
                onPressOut={likeButtonAnimation.onPressOut}
              >
                <Ionicons name="heart" size={34} color="#43A047" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.smallActionButton} 
                onPress={() => alert('Boost!')}
              >
                <Ionicons name="flash" size={24} color="#9C27B0" />
              </TouchableOpacity>
            </View>
          )}
          
          {/* Bottom Tab Bar */}
          <View style={styles.bottomTabBar}>
            <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
              <Ionicons name="flame" size={28} color="#FF4458" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tabButton}
              onPress={() => router.replace('/for-you')}
            >
              <Ionicons name="grid" size={28} color="#aaa" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tabButton}
              onPress={() => router.replace('/matches')}
            >
              <Ionicons name="star-outline" size={28} color="#aaa" />
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tabButton}
              onPress={() => router.replace('/messages')}
            >
              <Ionicons name="chatbubble-outline" size={28} color="#aaa" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tabButton}
              onPress={() => router.replace('/profile')}
            >
              <Ionicons name="person-outline" size={28} color="#aaa" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {filterVisible && (
        <Modal visible={true} onDismiss={() => hideModal(() => setFilterVisible(false))}>
          <Animated.View style={[styles.modalOverlay, overlayStyle]} />
          <Animated.View style={[styles.modalContainer, modalStyle]}>
            <Text variant="headlineMedium" style={styles.modalTitle}>{i18n.t('filters')}</Text>
            
            <Text variant="titleMedium" style={{ marginBottom: 16, textAlign: 'center' }}>{i18n.t('filterMatches')}</Text>
            <Text style={{ marginBottom: 4 }}>{i18n.t('ageRange')}</Text>
            <View style={styles.ageInputs}>
              <TextInput
                label={i18n.t('minAge')}
                value={String(ageRange[0])}
                onChangeText={handleAgeMin}
                keyboardType="numeric"
                style={styles.ageInput}
                mode="outlined"
              />
              <Text variant="bodyLarge" style={{ marginHorizontal: 8 }}>{i18n.t('to')}</Text>
              <TextInput
                label={i18n.t('maxAge')}
                value={String(ageRange[1])}
                onChangeText={handleAgeMax}
                keyboardType="numeric"
                style={styles.ageInput}
                mode="outlined"
              />
            </View>

            <Text variant="titleMedium" style={styles.filterLabel}>{i18n.t('maxDistance')}</Text>
            <TextInput
              label={i18n.t('distance')} 
              value={String(distance)}
              onChangeText={handleDistance}
              keyboardType="numeric"
              style={styles.distanceInput}
              mode="outlined"
            />

            <Text style={{ marginBottom: 4, marginTop: 12 }}>{i18n.t('interests')}</Text>
            <View style={styles.interestsContainer}>
              {allInterests.map(interest => (
                <Chip
                  key={interest}
                  selected={selectedInterests.includes(interest)}
                  onPress={() => toggleInterest(interest)}
                  style={styles.filterChip}
                  showSelectedOverlay
                >
                  {interest}
                </Chip>
              ))}
            </View>

            <Button 
              mode="contained" 
              onPress={applyFilters} 
              style={{ marginTop: 16 }}
            >
              {i18n.t('apply')}
            </Button>
          </Animated.View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    color: colors.error,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#f6f0ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#a085e9',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    margin: 16,
  },
  filterButton: {
    backgroundColor: '#a085e9',
  },
  swiperContainer: {
    height: 500,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 5,
  },
  card: {
    height: 500,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0, 255, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 2,
  },
  activeIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 120,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  verifiedBadge: {
    marginLeft: 10,
  },
  matchedPreferences: {
    marginTop: 2,
    marginBottom: 6,
  },
  matchedText: {
    color: '#00aff0',
    fontSize: 14,
  },
  attributesContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  attributeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attributeText: {
    color: '#fff',
    fontSize: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  smallActionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF4458',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 20,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 20,
  },
  passButton: {
    backgroundColor: '#E53935',
  },
  likeButton: {
    backgroundColor: '#43A047',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  interestChip: {
    margin: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  filterLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  ageInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageInput: {
    flex: 1,
  },
  distanceInput: {
    marginBottom: 10,
  },
  filterChip: {
    margin: 4,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: '#a085e9',
  },
});

// Export a React component as default for Expo Router
export default function Home() {
  return <HomeScreen />;
}
