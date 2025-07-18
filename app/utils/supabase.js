// URL polyfill for React Native
import 'react-native-url-polyfill';
// Import structuredClone polyfill
import '../utils/polyfills';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Use environment variables for Supabase credentials
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'datingapp-mobile',
    },
  },
  // Better network reliability settings for mobile
  realtime: {
    timeout: 30000, // 30 seconds
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Authentication helper functions
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { data: null, error };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error signing in:', error.message);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { error };
  }
};

export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'yourapp://reset-password',
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error resetting password:', error.message);
    return { data: null, error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Error getting current user:', error.message);
    return { user: null, error };
  }
};

export const getSession = async () => {
  // More aggressive for production: faster retries but fewer attempts
  const MAX_RETRIES = 2;
  const INITIAL_DELAY = 1000; // 1 second initial delay
  
  const attemptGetSession = async (retryCount = 0) => {
    try {
      if (retryCount > 0) {
        console.log(`Attempting to get session (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      }
      
      // Use a shorter timeout for the actual request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        clearTimeout(timeoutId);
        
        if (error) {
          throw error;
        }
        
        return { session, error: null };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      // Check for specific network/timeout errors that are likely temporary
      const isTemporaryError = 
        error.message?.includes('network') ||
        error.message?.includes('timeout') ||
        error.message?.includes('abort') ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT';
      
      // Only retry for temporary errors
      if (isTemporaryError && retryCount < MAX_RETRIES) {
        const delay = INITIAL_DELAY * Math.pow(1.5, retryCount); // Exponential backoff
        console.log(`Network error, retrying in ${delay/1000} seconds...`);
        
        return new Promise(resolve => {
          setTimeout(() => resolve(attemptGetSession(retryCount + 1)), delay);
        });
      }
      
      // For permanent errors or when retries are exhausted
      return { session: null, error };
    }
  };
  
  return attemptGetSession();
};

// Social auth providers
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
    return { data: null, error };
  }
};

export const signInWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error signing in with Facebook:', error.message);
    return { data: null, error };
  }
};

// Auth state change listener
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Default export for Expo Router compatibility
export default {
  supabase,
  signUp,
  signIn,
  signOut,
  resetPassword,
  getCurrentUser,
  getSession,
  signInWithGoogle,
  signInWithFacebook,
  onAuthStateChange
};
