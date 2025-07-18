import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getCurrentUser, getSession, onAuthStateChange } from '../utils/supabase';
import * as profileService from '../services/profileService';

// Create the auth context
export const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      console.log('Initializing auth...');
      
      try {
        // Get current session - this now has built-in retry logic
        const { session: currentSession, error: sessionError } = await getSession();
        
        if (sessionError) {
          console.error('Session fetch error:', sessionError.message);
          throw sessionError; // Properly throw the error to be handled
        }
        
        console.log('Session fetched:', currentSession ? 'valid session' : 'no session');
        setSession(currentSession);
        
        if (currentSession) {
          try {
            // Get user data if session exists
            const { user: currentUser } = await getCurrentUser();
            console.log('User fetched:', currentUser ? 'valid user' : 'no user');
            setUser(currentUser);
          } catch (userError) {
            console.error('Error fetching user:', userError.message);
            // Clear session if we can't fetch the user
            setSession(null);
            throw userError; // Propagate the error
          }
        } else {
          console.log('No active session found');
          // This is normal for logged out users
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error.message);
        // Continue with app initialization even on error
      } finally {
        console.log('Auth initialization complete');
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: authListener } = onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN' && session) {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          // Check if profile exists for this user
          console.log('Checking profile existence for user:', currentUser.id);
          const { profile: existingProfile, error: profileError } = await profileService.getProfile(currentUser.id);
          
          if (!existingProfile && !profileError) {
            // No profile found, create one
            console.log('No profile found for user. Creating profile...');
            const { profile: newProfile, error: createError } = await profileService.createProfile(
              currentUser.id,
              {
                name: currentUser.user_metadata?.name || 'User',
                email: currentUser.email,
                created_at: new Date().toISOString(),
                avatar_url: null,
                gender: null,
                looking_for: null,
                bio: '',
                location: null,
                birth_date: null,
                last_active: new Date().toISOString()
              }
            );
            
            if (createError) {
              console.error('Error creating profile during auth:', createError);
            } else {
              console.log('Profile created successfully during auth:', newProfile);
            }
          } else if (existingProfile) {
            console.log('Existing profile found for user');
          } else if (profileError) {
            console.error('Error checking profile existence:', profileError);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
    });
    
    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Sign in with email and password
  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error.message);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email, password) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error.message);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error.message);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (profileData) => {
    setIsLoading(true);
    try {
      // First update auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: profileData,
      });
      
      if (updateError) throw updateError;
      
      // Then update the profiles table if you have one
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            updated_at: new Date(),
            ...profileData,
          });
        
        if (profileError) throw profileError;
      }
      
      // Refresh user data
      const { user: updatedUser } = await getCurrentUser();
      setUser(updatedUser);
      
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error.message);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Add default export for Expo Router compatibility
export default function AuthContextProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
