import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../utils/theme';
import AppLogo from '../../assets/app-logo';

const { width } = Dimensions.get('window');
const CARD_SPACING = 12;
const CARD_WIDTH = (width - (CARD_SPACING * 3)) / 2;

export default function ForYouScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState([
    {
      id: '1',
      title: 'Date Night',
      count: '4.7K',
      image: 'https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?ixlib=rb-4.0.3',
      color: '#8A2BE2',
    },
    {
      id: '2',
      title: 'Binge Watchers',
      count: '11K',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3',
      color: '#006A4E',
    },
    {
      id: '3',
      title: 'Creatives',
      count: '6.2K',
      image: 'https://images.unsplash.com/photo-1536924430914-91f9e2041b83?ixlib=rb-4.0.3',
      color: '#00008B',
    },
    {
      id: '4',
      title: 'Sporty',
      count: '15.3K',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3',
      color: '#8A2BE2',
    },
    {
      id: '5',
      title: 'Self Care',
      count: '7.2K',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3',
      color: '#8A2BE2',
    },
    {
      id: '6',
      title: 'Thrill Seekers',
      count: '5.8K',
      image: 'https://images.unsplash.com/photo-1536697246787-1f7ae568d89a?ixlib=rb-4.0.3',
      color: '#FF8C00',
    },
    {
      id: '7',
      title: 'Gamers',
      count: '1.8K',
      image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?ixlib=rb-4.0.3',
      color: '#8A2BE2',
    },
    {
      id: '8',
      title: 'Animal Parents',
      count: '478',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3',
      color: '#FF8C00',
    }
  ]);
  
  const navigateToCategory = (category) => {
    // In a real app, this would navigate to a list of profiles with this interest
    console.log(`Navigate to ${category.title}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppLogo width={80} height={30} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>For You</Text>
        <Text style={styles.sectionSubtitle}>Recommendations based on your profile</Text>
        
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => navigateToCategory(category)}
            >
              <View style={[styles.categoryContent, { backgroundColor: category.color }]}>
                <Image 
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{category.count}</Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.categoryTitle}>
                    {category.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="flame-outline" size={28} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, styles.activeTab]}
        >
          <Ionicons name="grid" size={28} color="#FF4458" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/matches')}
        >
          <Ionicons name="star-outline" size={28} color="#aaa" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    alignItems: 'flex-start',
  },
  logo: {
    width: 80,
    height: 30,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    marginBottom: CARD_SPACING,
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryContent: {
    flex: 1,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  countBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  categoryTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabButton: {
    alignItems: 'center',
    padding: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#FF4458',
  },
});
