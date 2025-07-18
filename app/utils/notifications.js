import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notifications to show alerts, badges, and sounds
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#a085e9',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    // Get the token that uniquely identifies this device
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with your actual Expo project ID
    })).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

// Send a local notification
export async function sendLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // Show immediately
  });
}

// Send a match notification
export async function sendMatchNotification(matchName) {
  await sendLocalNotification(
    '💘 New Match!',
    `You and ${matchName} have matched! Say hello!`,
    { screen: 'matches' }
  );
}

// Send a message notification
export async function sendMessageNotification(senderName, message) {
  await sendLocalNotification(
    `💬 New message from ${senderName}`,
    message.length > 30 ? message.substring(0, 30) + '...' : message,
    { screen: 'messages', senderId: senderName }
  );
}

// Send a like notification
export async function sendLikeNotification() {
  await sendLocalNotification(
    '❤️ New Like!',
    'Someone liked your profile! Open the app to find out who.',
    { screen: 'matches' }
  );
}

// Add notification listeners
export function addNotificationListeners(notificationListener, responseListener) {
  const notificationSubscription = Notifications.addNotificationReceivedListener(notificationListener);
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(responseListener);
  
  return () => {
    notificationSubscription.remove();
    responseSubscription.remove();
  };
}

// Default export for Expo Router compatibility
export default {
  registerForPushNotificationsAsync,
  sendLocalNotification,
  sendMatchNotification,
  sendMessageNotification,
  sendLikeNotification,
  addNotificationListeners
};
