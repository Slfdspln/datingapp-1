import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import profileService from '../services/profileService';
import AppLogo from '../../assets/app-logo';

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // In a real app, this would fetch from a notifications table in Supabase
        // For now, we'll use mock data
        const mockNotifications = [
          {
            id: '1',
            type: 'match',
            read: false,
            createdAt: new Date().toISOString(),
            data: {
              matchId: 'abc123',
              userId: 'user1',
              userName: 'Jessica',
              userImage: 'https://randomuser.me/api/portraits/women/32.jpg',
            }
          },
          {
            id: '2',
            type: 'like',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            data: {
              userId: 'user2',
              userName: 'Michael',
              userImage: 'https://randomuser.me/api/portraits/men/45.jpg',
            }
          },
          {
            id: '3',
            type: 'message',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            data: {
              matchId: 'abc456',
              userId: 'user3',
              userName: 'Emma',
              userImage: 'https://randomuser.me/api/portraits/women/22.jpg',
              messagePreview: 'Hey, how are you doing today?'
            }
          },
          {
            id: '4',
            type: 'superlike',
            read: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            data: {
              userId: 'user4',
              userName: 'David',
              userImage: 'https://randomuser.me/api/portraits/men/67.jpg',
            }
          },
          {
            id: '5',
            type: 'system',
            read: true,
            createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
            data: {
              title: 'Complete your profile',
              description: 'Add more photos to get more matches!',
              actionText: 'Edit Profile'
            }
          }
        ];
        
        setNotifications(mockNotifications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE'); // Day name
    } else {
      return format(date, 'MMM d'); // Month day
    }
  };

  const handleNotificationPress = (notification) => {
    // Mark as read logic would go here
    // In a real app, this would update the read status in Supabase
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'match':
        router.push(`/(tabs)/messages/${notification.data.matchId}`);
        break;
      case 'message':
        router.push(`/(tabs)/messages/${notification.data.matchId}`);
        break;
      case 'like':
      case 'superlike':
        router.push({
          pathname: '/(modals)/premium',
          params: { source: 'notification' }
        });
        break;
      case 'system':
        if (notification.data.actionText === 'Edit Profile') {
          router.push('/(tabs)/profile');
        }
        break;
      default:
        break;
    }
  };

  const renderNotification = ({ item }) => {
    const notification = item;
    
    // Common notification container style
    const containerStyle = [
      styles.notificationContainer,
      !notification.read && styles.unreadNotification
    ];
    
    // Render different notification types
    switch (notification.type) {
      case 'match':
        return (
          <TouchableOpacity 
            style={containerStyle}
            onPress={() => handleNotificationPress(notification)}
          >
            <LinearGradient
              colors={['#FF4458', '#FF7B69']}
              style={styles.matchBadge}
            >
              <Ionicons name="heart" size={14} color="#fff" />
            </LinearGradient>
            <Image 
              source={{ uri: notification.data.userImage }}
              style={styles.userImage}
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                You matched with <Text style={styles.userName}>{notification.data.userName}</Text>
              </Text>
              <Text style={styles.notificationTime}>{formatDate(notification.createdAt)}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        );
        
      case 'like':
        return (
          <TouchableOpacity 
            style={containerStyle}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={24} color="#FF4458" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                <Text style={styles.userName}>{notification.data.userName}</Text> liked you. Match with them instantly!
              </Text>
              <Text style={styles.notificationTime}>{formatDate(notification.createdAt)}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        );
        
      case 'superlike':
        return (
          <TouchableOpacity 
            style={containerStyle}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={24} color="#00aff0" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                <Text style={styles.userName}>{notification.data.userName}</Text> super liked you!
              </Text>
              <Text style={styles.notificationTime}>{formatDate(notification.createdAt)}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        );
        
      case 'message':
        return (
          <TouchableOpacity 
            style={containerStyle}
            onPress={() => handleNotificationPress(notification)}
          >
            <Image 
              source={{ uri: notification.data.userImage }}
              style={styles.userImage}
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                <Text style={styles.userName}>{notification.data.userName}</Text> sent you a message
              </Text>
              <Text style={styles.messagePreview} numberOfLines={1}>
                {notification.data.messagePreview}
              </Text>
              <Text style={styles.notificationTime}>{formatDate(notification.createdAt)}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        );
        
      case 'system':
        return (
          <TouchableOpacity 
            style={containerStyle}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle" size={24} color="#ffc107" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>{notification.data.title}</Text>
              <Text style={styles.systemMessage}>{notification.data.description}</Text>
              <Text style={styles.notificationTime}>{formatDate(notification.createdAt)}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        );
        
      default:
        return null;
    }
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={48} color="#666" />
      <Text style={styles.emptyText}>No notifications yet</Text>
      <Text style={styles.emptySubtext}>
        You'll receive notifications when you get new matches, messages and more
      </Text>
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>All Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Messages</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContentContainer}
      />
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
  settingsButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4458',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: 'rgba(255, 68, 88, 0.05)',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  matchBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 2,
  },
  userName: {
    fontWeight: 'bold',
    color: '#fff',
  },
  messagePreview: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 2,
  },
  systemMessage: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4458',
    position: 'absolute',
    right: 16,
    top: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
