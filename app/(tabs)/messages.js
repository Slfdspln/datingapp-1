import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Text, Avatar, IconButton, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profileService';
import { supabase } from '../utils/supabase';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

// Helper function to generate a consistent fallback receiver ID for testing
const generateFallbackReceiverId = (userId) => {
  // Generate a valid UUID v4 format that looks real but is consistent
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    // Use a deterministic approach for testing so we always get the same ID for the same user
    const r = userId.length % 16;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const MessagesScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [matchProfile, setMatchProfile] = useState(null);
  const flatListRef = useRef(null);
  
  // Get matchId and matchName from params or use null for all messages view
  const matchId = params?.matchId;
  const matchName = params?.matchName;
  
  // Debug params
  console.log('Messages screen params:', { matchId, matchName, rawParams: params });
  
  // Ensure we have valid IDs to avoid SQL errors
  // If matchId isn't a valid UUID or is missing, set it to null explicitly
  const safeMatchId = matchId && matchId !== 'undefined' && matchId !== 'null' 
    ? String(matchId)
    : null;
    
  // Function to fetch the match's profile data
  const fetchMatchProfile = async () => {
    if (!safeMatchId && !matchId) return;
    
    try {
      const receiverId = safeMatchId || matchId;
      const { profile, error } = await profileService.getProfileById(receiverId);
      
      if (error) {
        console.error('Error fetching match profile:', error);
        return;
      }
      
      if (profile) {
        console.log('Fetched match profile:', profile);
        setMatchProfile(profile);
      }
    } catch (err) {
      console.error('Error in fetchMatchProfile:', err);
    }
  };
  
  useEffect(() => {
    if (!user) {
      console.log('No user available for fetching messages');
      return;
    }
    
    console.log('Fetching messages between users:', { userId: user.id, matchId: safeMatchId });
    
    // Fetch match profile if we have a match ID
    fetchMatchProfile();
    
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { messages: chatMessages, error: messagesError } = await profileService.getMessages(
          user.id,
          safeMatchId // If matchId is provided, get messages for that match only
        );
        
        console.log('Fetched messages result:', { 
          count: chatMessages?.length || 0, 
          error: messagesError 
        });
        
        if (messagesError) throw messagesError;
        
        // Sort messages by timestamp
        const sortedMessages = chatMessages.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        
        console.log('Sorted messages:', sortedMessages);
        setMessages(sortedMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [user, safeMatchId]);
  
  useEffect(() => {
    if (!user || (!safeMatchId && !matchId)) return;
    
    // Use either safeMatchId or matchId (raw ID)
    const receiverId = safeMatchId || matchId;
    
    // Set up real-time subscription for new messages
    console.log('Setting up real-time message subscription for match:', receiverId);
    
    // Create a unique channel name that includes both user IDs to avoid conflicts
    const channelName = `messages-${user.id}-${receiverId}`;
    
    // Filter for messages where the current user is involved and with the specific match
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        {
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages'
          // No filter - we'll handle filtering in the callback
          // This avoids issues with invalid UUID format
        }, 
        (payload) => {
          const newMsg = payload.new;
          
          // Manually filter the messages for the current conversation
          const isRelevantMessage = 
            (newMsg.sender_id === user.id && newMsg.receiver_id === receiverId) || 
            (newMsg.sender_id === receiverId && newMsg.receiver_id === user.id);
          
          if (isRelevantMessage) {
            console.log('New message received from subscription:', newMsg);
            setMessages(prevMessages => [...prevMessages, newMsg]);
            
            // Scroll to the bottom to show the new message
            setTimeout(() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
              }
            }, 100);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
    
    // Clean up subscription on unmount
    return () => {
      console.log('Cleaning up message subscription');
      channel.unsubscribe();
    };
  }, [user, safeMatchId]);
  
  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (!user || !newMessage.trim() || sending) return;
    
    // If there's no match ID, we can't send a message
    if (!safeMatchId && !matchId) {
      console.error('Cannot send message: No match ID provided');
      alert('Cannot send message: No match selected');
      return;
    }
    
    setSending(true);
    
    try {
      // Make sure we have a valid receiver ID
      // Use the raw matchId if safeMatchId is null (it might be a valid ID that didn't pass our strict check)
      const receiverId = safeMatchId || matchId;
      
      console.log('Sending message to:', { userId: user.id, receiverId, content: newMessage });
      
      // Send the message and handle possible errors
      const { message, error: sendError, fallbackUsed } = await profileService.sendMessage(
        user.id,
        receiverId,
        newMessage.trim()
      );
      
      console.log('Send message response:', { message, error: sendError, fallbackUsed });
      
      if (sendError) {
        console.error('Error sending message:', sendError);
        if (!fallbackUsed) {
          throw sendError;
        }
      }
      
      // Clear the message input regardless of success/failure
      setNewMessage('');
      
      // Add the sent message to the local state immediately for better UX
      if (message) {
        console.log('Adding new message to state:', message);
        // Ensure the message has all required properties for rendering
        const completeMessage = {
          ...message,
          id: message.id || `local-${Date.now()}`,
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage.trim(), // Use the actual content we tried to send
          created_at: message.created_at || new Date().toISOString()
        };
        
        setMessages(prevMessages => [...prevMessages, completeMessage]);
        
        // Scroll to the bottom to show the new message
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      } else {
        console.warn('No message returned from sendMessage');
        // Still add a local message for better UX
        const localMessage = {
          id: `local-${Date.now()}`,
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage.trim(),
          created_at: new Date().toISOString(),
          isLocal: true // Flag to identify local messages
        };
        setMessages(prevMessages => [...prevMessages, localMessage]);
      }
      // Note: setNewMessage('') is already called above
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Format message date for display
  const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    // Check if message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Check if message is from yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // For older messages
    return messageDate.toLocaleDateString() + ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render message item for the FlatList
  const renderMessage = ({ item, index }) => {
    const isMyMessage = item.sender_id === user?.id;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    const isFirstInGroup = !prevMessage || prevMessage.sender_id !== item.sender_id;
    const isLastInGroup = !nextMessage || nextMessage.sender_id !== item.sender_id;
    
    return (
      <View style={styles.messageContainer}>
        {!isMyMessage && isFirstInGroup && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{matchName ? matchName[0].toUpperCase() : '?'}</Text>
            </View>
          </View>
        )}
        
        <View style={[
          styles.messageBubble, 
          isMyMessage ? styles.myMessage : styles.theirMessage,
          isFirstInGroup && (isMyMessage ? styles.firstMyMessage : styles.firstTheirMessage),
          isLastInGroup && (isMyMessage ? styles.lastMyMessage : styles.lastTheirMessage)
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText
          ]}>
            {item.content || "[No message content]"}
          </Text>
          
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.theirMessageTime
          ]}>
            {formatMessageDate(item.created_at)}
            {isMyMessage && <Text style={styles.readStatus}> ✓</Text>}
          </Text>
        </View>
        
        {isMyMessage && isFirstInGroup && (
          <View style={styles.myAvatarSpacer} />
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back navigation and match info */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        
        {matchId && matchName && (
          <TouchableOpacity 
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              if (matchProfile) {
                // Navigate to profile view with the match profile data
                router.push({
                  pathname: '/(modals)/profile-view',
                  params: { profile: JSON.stringify(matchProfile) }
                });
              } else {
                console.log('Match profile not available');
                // Try to fetch profile again
                fetchMatchProfile();
              }
            }}
          >
            <View style={styles.matchAvatar}>
              {matchProfile?.image ? (
                <Avatar.Image 
                  size={40} 
                  source={{ uri: matchProfile.image }} 
                />
              ) : (
                <Text style={styles.matchInitial}>{matchName ? matchName[0].toUpperCase() : '?'}</Text>
              )}
            </View>
            <View>
              <Text style={styles.headerTitle}>{matchName || 'Chat'}</Text>
              <Text style={{fontSize: 12, color: '#666'}}>
                {matchProfile?.last_active ? 'Last active ' + new Date(matchProfile.last_active).toLocaleDateString() : 'Active now'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        
        {/* Action buttons */}
        {matchId && matchName && (
          <View style={{flexDirection: 'row', marginLeft: 'auto'}}>
            <TouchableOpacity 
              style={{marginRight: 16}}
              onPress={() => {
                if (matchProfile) {
                  // Navigate to profile view with the match profile data
                  router.push({
                    pathname: '/(modals)/profile-view',
                    params: { profile: JSON.stringify(matchProfile) }
                  });
                } else {
                  fetchMatchProfile();
                }
              }}
            >
              <Ionicons name="person" size={22} color="#0084ff" />
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: 16}}>
              <Ionicons name="videocam-outline" size={22} color="#0084ff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="shield-checkmark-outline" size={22} color="#0084ff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Match notification banner - for new matches */}
      {matchId && matchName && messages.length === 0 && (
        <View style={styles.matchNotification}>
          <View style={styles.matchCircle}>
            <Ionicons name="heart" size={20} color="#fff" />
          </View>
          <Text style={styles.matchText}>You matched with {matchName} {Math.floor(Math.random() * 12) + 1} hours ago</Text>
        </View>
      )}
      
      {/* Messages list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id || item.created_at}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.startPrompt}>Say Hello! 👋</Text>
              <Text style={styles.emptyText}>
                Break the ice with a friendly message
              </Text>
            </View>
          }
        />
      )}
      
      {/* Feature promotions banner */}
      {matchId && (
        <View style={styles.featurePrompt}>
          <Ionicons name="musical-notes" size={18} color="#fff" />
          <Text style={styles.featurePromptText}>NEW! Tap here to send a song</Text>
        </View>
      )}

      {/* Input area */}
      {matchId && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
          style={styles.inputContainer}
        >
          {/* Emoji button */}
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="happy-outline" size={24} color="#0084ff" />
          </TouchableOpacity>

          {/* Text input */}
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />

          {/* Media buttons */}
          <View style={styles.mediaButtonsContainer}>
            <TouchableOpacity style={styles.mediaButton}>
              <Ionicons name="image-outline" size={24} color="#0084ff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaButton}>
              <Text style={styles.gifButton}>GIF</Text>
            </TouchableOpacity>
          </View>

          {/* Send button */}
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  matchAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  matchInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startPrompt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  matchNotification: {
    backgroundColor: '#f7f7f7',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchCircle: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  matchText: {
    flex: 1,
    fontSize: 14,
  },
  featurePrompt: {
    backgroundColor: '#0084ff',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featurePromptText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  avatarContainer: {
    width: 36,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  myAvatarSpacer: {
    width: 36,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessage: {
    backgroundColor: '#0084ff',
    marginLeft: 'auto',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: '#f0f0f0',
    marginRight: 'auto',
    borderBottomLeftRadius: 4,
  },
  firstMyMessage: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  lastMyMessage: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 4,
  },
  firstTheirMessage: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  lastTheirMessage: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#888',
  },
  readStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  mediaButton: {
    padding: 6,
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
  },
  gifButton: {
    color: '#0084ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#b3daff',
  },
});

export default MessagesScreen;
