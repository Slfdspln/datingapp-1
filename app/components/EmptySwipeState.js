import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppLogo from '../../assets/app-logo';

export default function EmptySwipeState({ onRefresh }) {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Create pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Create subtle rotation animation for outer ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppLogo width={80} height={30} />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        {/* Main animated circle component */}
        <View style={styles.circleContainer}>
          {/* Rotating outer circle */}
          <Animated.View 
            style={[
              styles.outerCircle, 
              { transform: [{ rotate }] }
            ]}
          />
          
          {/* Middle static circle */}
          <View style={styles.middleCircle} />
          
          {/* Inner pulsing circle with user avatar */}
          <Animated.View 
            style={[
              styles.innerCircle, 
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatarImage}
            />
          </Animated.View>
        </View>
        
        {/* Action buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.smallActionButton} 
            onPress={() => router.replace('/explore')}
          >
            <Ionicons name="refresh" size={24} color="#FFCA28" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => router.replace('/matches')}
          >
            <Ionicons name="close" size={34} color="#FF4458" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.smallActionButton}
            onPress={() => router.replace('/for-you')}
          >
            <Ionicons name="star" size={24} color="#00aff0" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onRefresh}
          >
            <Ionicons name="heart" size={34} color="#43A047" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.smallActionButton} 
            onPress={() => router.replace('/profile')}
          >
            <Ionicons name="flash" size={24} color="#9C27B0" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Ionicons name="flame" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/explore')}
        >
          <Ionicons name="compass" size={28} color="#aaa" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 80,
    height: 30,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  outerCircle: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4,
    borderColor: '#f0f0f0',
  },
  middleCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#f7f7f7',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 30,
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
});
