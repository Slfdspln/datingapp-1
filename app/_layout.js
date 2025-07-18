import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import fallback theme first, before any circular imports can happen
const fallbackTheme = {
  colors: {
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
  }
};

// IMPORTANT: Import order matters for avoiding circular dependencies
// Import basic components first, then context providers
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import theme AFTER AuthProvider to prevent circular references
import { theme } from './utils/theme';

// Only import notifications after all UI components
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './utils/notifications';
import { View, ActivityIndicator } from 'react-native';

// Auth routing component to handle protected routes
function AuthRoot() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('Auth state changed:', { isLoading, user: !!user, segments, inAuthGroup: segments[0] === '(auth)' });
    
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // If user is not authenticated and not in auth screens, redirect to login
    if (!user && !inAuthGroup) {
      console.log('Redirecting to login: No user and not in auth group');
      router.replace('/(auth)/login');
    } 
    // If user is authenticated but needs to complete onboarding, redirect there
    else if (user && user.hasCompletedOnboarding === false && !segments.includes('onboarding')) {
      console.log('Redirecting to onboarding: User exists but hasCompletedOnboarding is false');
      router.replace('/(auth)/onboarding');
    } 
    // If user is authenticated and has completed onboarding but is in auth group, go to main app
    else if (user && inAuthGroup && segments[1] !== 'onboarding') {
      console.log('Redirecting to main app: User exists and in auth group');
      router.replace('/(tabs)');
    } else {
      console.log('No redirection needed. Current state:', { 
        hasUser: !!user, 
        userCompletedOnboarding: user?.hasCompletedOnboarding,
        currentSegment: segments[0]
      });
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme?.colors?.primary || fallbackTheme.colors.primary} />
      </View>
    );
  }

  return <RootLayoutNav />;
}

// Root layout navigation component
function RootLayoutNav() {
  // Set up notifications once when the component mounts
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log('Notification token:', token));
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="(modals)/profile-view" 
        options={{ 
          presentation: 'modal',
          title: 'Profile',
          headerStyle: {
            backgroundColor: theme?.colors?.primary || fallbackTheme.colors.primary,
          },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="(modals)/settings" 
        options={{ 
          presentation: 'modal',
          title: 'Settings',
        }} 
      />
      <Stack.Screen 
        name="(modals)/premium" 
        options={{ 
          presentation: 'modal',
          title: 'Premium Features',
          headerStyle: {
            backgroundColor: theme?.colors?.accent || fallbackTheme.colors.accent,
          },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="(modals)/notifications" 
        options={{ 
          presentation: 'modal',
          title: 'Notifications',
        }} 
      />
    </Stack>
  );
}

// Export the root layout wrapped with AuthProvider
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider theme={theme || fallbackTheme}>
          <AuthRoot />
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
