import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, ActivityIndicator, Animated, Dimensions, ScrollView } from 'react-native';
import { Text, Avatar, Button, Divider, Badge, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profileService';
import { colors } from '../utils/theme';

// Fallback colors in case theme colors are temporarily undefined during initialization
const fallbackColors = {
  primary: '#FF4458',
  background: '#000000',
  surface: '#121212',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  card: '#1C1C1E',
  error: '#CF6679',
  notification: '#F24822',
  accent: '#03DAC6'
};
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Create a simple MatchesTab component that just renders the main MatchesScreen
export default function MatchesTab() {
  return <MatchesScreen />;
}

// Main MatchesScreen component with all functionality
function MatchesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');
  
  // Animation values for empty state card stack
  const cardRotation = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  
  // Start animations for card stack
  useEffect(() => {
    if (matches.length === 0 && !loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cardRotation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
          }),
          Animated.timing(cardRotation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true
          })
        ])
      ).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(cardScale, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true
          }),
          Animated.timing(cardScale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [matches, loading]);
  
  const rotateInterpolate = cardRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg']
  });

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const { matches: userMatches, error: matchError } = await profileService.getMatches(user.id);

        if (matchError) throw matchError;

        setMatches(userMatches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load your matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  const navigateToMessages = (match) => {
    console.log('Navigating to messages with match:', match);
    router.push({
      pathname: '/messages',
      params: { 
        matchId: match.user.id, // Pass the matched user's ID, not the match record ID
        matchName: match.user.name 
      }
    });
  };

  const renderMatchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.matchItem}
      onPress={() => navigateToMessages(item)}
    >
      <View style={styles.avatarContainer}>
        <Avatar.Image 
          size={70} 
          source={{ uri: item.user?.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
          style={styles.avatar}
        />
        <Badge 
          size={16} 
          style={styles.onlineBadge} 
          color="#4CAF50"
        />
      </View>
      <View style={styles.matchInfo}>
        <View style={styles.nameRow}>
          <Text variant="titleMedium" style={styles.matchName}>{item.user?.name}</Text>
          {Math.random() > 0.5 && (
            <MaterialCommunityIcons name="check-decagram" size={18} color="#00aff0" style={styles.verifiedIcon} />
          )}
        </View>
        <View style={styles.lastActiveContainer}>
          <Text style={styles.lastActive}>Active 2h ago</Text>
        </View>
        <Text variant="bodySmall" style={styles.matchBio} numberOfLines={2}>
          {item.user?.bio ? item.user.bio : 'No bio available'}
        </Text>
      </View>
      <View style={styles.actionColumn}>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => navigateToMessages(item)}
        >
          <Ionicons name="chatbubble" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.matchStatusBadge}>
          <Text style={styles.matchStatusText}>NEW</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
        onPress={() => setActiveTab('matches')}
      >
        <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>0 likes</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
        onPress={() => setActiveTab('sent')}
      >
        <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>Likes Sent</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'picks' && styles.activeTab]}
        onPress={() => setActiveTab('picks')}
      >
        <Text style={[styles.tabText, activeTab === 'picks' && styles.activeTabText]}>Top Picks</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.prioritySection}>
        <View style={styles.priorityHeader}>
          <Image 
            source={{uri: 'https://randomuser.me/api/portraits/lego/3.jpg'}}
            style={styles.priorityAvatar}
          />
          <View style={styles.priorityContent}>
            <Text style={styles.priorityTitle}>Trade up with Priority Likes</Text>
            <Text style={styles.priorityText}>Get noticed sooner, and increase your chances of matching by up to 30%.</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>New matches</Text>
      
      <View style={styles.emptyMatchesSection}>
        <View style={styles.getLikesCard}>
          <View style={styles.likesIconContainer}>
            <Ionicons name="heart-outline" size={32} color="#fff" />
          </View>
          <Text style={styles.getLikesText}>Get Likes</Text>
        </View>
        
        <View style={styles.cardStackContainer}>
          <Animated.View style={[styles.cardBack, {
            transform: [
              { rotate: rotateInterpolate },
              { scale: cardScale }
            ]
          }]} />
          <Animated.View style={[styles.cardMiddle, {
            transform: [
              { rotate: rotateInterpolate },
              { scale: cardScale }
            ]
          }]} />
          <Animated.View style={[styles.cardFront, {
            transform: [
              { rotate: rotateInterpolate },
              { scale: cardScale }
            ]
          }]}>
            <View style={styles.likeContainer}>
              <Text style={styles.likeText}>LIKE</Text>
            </View>
          </Animated.View>
        </View>
      </View>
      
      <View style={styles.getSwipingContainer}>
        <Text style={styles.getSwipingTitle}>Get swiping</Text>
        <Text style={styles.getSwipingText}>When you match with other users they'll appear here, where you can send them a message</Text>
      </View>
    </View>
  );

  // Make sure we have styles defined even if theme isn't loaded yet
  const safeStyles = styles || {
    container: { flex: 1, backgroundColor: fallbackColors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    logoText: { fontSize: 24, fontWeight: 'bold', color: fallbackColors.primary },
    headerActions: { flexDirection: 'row' },
    headerButton: { marginLeft: 16 },
    headerButtonIcon: { width: 24, height: 24, tintColor: fallbackColors.primary },
    content: { flex: 1 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    emptyText: { color: fallbackColors.textSecondary, fontSize: 16, textAlign: 'center', marginTop: 8 },
    matchList: { flex: 1, paddingHorizontal: 16 },
    getSwipingContainer: { padding: 16, alignItems: 'center' },
    getSwipingTitle: { fontSize: 20, fontWeight: 'bold', color: fallbackColors.text, marginBottom: 8 },
    getSwipingText: { fontSize: 16, color: fallbackColors.textSecondary, textAlign: 'center' }
  };
  
  return (
    <SafeAreaView style={safeStyles.container}>
      <View style={safeStyles.header}>
        <Text style={safeStyles.logoText}>DateMe</Text>
        <View style={safeStyles.headerActions || { flexDirection: 'row' }}>
          <TouchableOpacity style={safeStyles.headerButton || {}}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {renderTabs()}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4458" />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            buttonColor="#FF4458"
            onPress={() => fetchMatches()}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : matches.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: (colors || fallbackColors).background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: (colors || fallbackColors).border,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: (colors || fallbackColors).primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 20,
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#FF4458',
  },
  retryButton: {
    marginTop: 8,
  },
  emptyStateContainer: {
    flex: 1,
  },
  prioritySection: {
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    padding: 16,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  priorityContent: {
    flex: 1,
  },
  priorityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  emptyMatchesSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  getLikesCard: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  likesIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 25,
  },
  getLikesText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  cardStackContainer: {
    width: 240,
    height: 150,
    position: 'relative',
  },
  cardBack: {
    width: 220,
    height: 140,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  cardMiddle: {
    width: 220,
    height: 140,
    backgroundColor: '#282828',
    borderRadius: 10,
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 2,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  cardFront: {
    width: 220,
    height: 140,
    backgroundColor: '#333',
    borderRadius: 10,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 3,
    borderWidth: 0.5,
    borderColor: '#444',
    overflow: 'hidden',
  },
  likeContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -15 }, { rotate: '-20deg' }],
    borderWidth: 2,
    borderColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  likeText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  getSwipingContainer: {
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  getSwipingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  getSwipingText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    backgroundColor: '#333',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#000',
  },
  matchInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  lastActiveContainer: {
    marginVertical: 2,
  },
  lastActive: {
    fontSize: 12,
    color: '#aaa',
  },
  matchBio: {
    color: '#aaa',
    marginTop: 4,
  },
  actionColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4458',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchStatusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 69, 88, 0.2)',
    borderRadius: 10,
  },
  matchStatusText: {
    color: '#FF4458',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

// Make sure MatchesScreen function is properly closed
}
