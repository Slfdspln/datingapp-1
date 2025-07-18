import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../utils/theme';
import * as profileService from '../services/profileService';
// Import i18n only if it's properly initialized
const i18n = require('../utils/i18n').default || { t: (key) => key };

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const validateForm = () => {
    if (!email || !password || !confirmPassword || !name) {
      setError('All fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      return false;
    }
    
    return true;
  };
  
  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        setError(error.message || 'Failed to sign up');
        return;
      }
      
      // Check if user was created successfully
      if (data?.user) {
        console.log('User created successfully, now creating profile...');
        
        // Create a profile for the new user
        const { profile, error: profileError } = await profileService.createProfile(
          data.user.id,
          { 
            name: name,
            email: email,
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
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Still show success since the auth account was created
        } else {
          console.log('Profile created successfully:', profile);
        }
        
        // Show success message instead of redirecting immediately
        setSignupSuccess(true);
        // We'll keep the user on this screen with a success message
        // instead of navigating away immediately
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {signupSuccess ? (
          <Animated.View 
            entering={FadeIn.duration(300)} 
            style={styles.content}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>❤️ DateMate</Text>
            </View>
            
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent a confirmation link to <Text style={styles.emailHighlight}>{email}</Text>.
              </Text>
              <Text style={styles.successText}>
                Please click the link in that email to verify your account before signing in.
              </Text>
              
              <Button
                mode="contained"
                onPress={() => router.replace('/(auth)/login')}
                style={[styles.button, {marginTop: 24}]}
              >
                Go to Login
              </Button>
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            entering={FadeIn.duration(300)} 
            style={styles.content}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>❤️ DateMate</Text>
              <Text variant="headlineLarge" style={styles.title}>Create Account</Text>
            </View>
            
            <View style={styles.form}>
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                autoComplete="new-password"
                textContentType="newPassword"
                right={
                  <TextInput.Icon 
                    icon={secureTextEntry ? "eye" : "eye-off"} 
                    onPress={() => setSecureTextEntry(!secureTextEntry)} 
                  />
                }
                style={styles.input}
              />
              
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={confirmSecureTextEntry}
                autoComplete="new-password"
                textContentType="newPassword"
                right={
                  <TextInput.Icon 
                    icon={confirmSecureTextEntry ? "eye" : "eye-off"} 
                    onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)} 
                  />
                }
                style={styles.input}
              />
              
              <View style={styles.termsContainer}>
                <Checkbox
                  status={termsAccepted ? 'checked' : 'unchecked'}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                  color={colors.primary}
                />
                <View style={styles.termsTextContainer}>
                  <Text>I accept the </Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.termsLink}>Terms of Service</Text>
                  </TouchableOpacity>
                  <Text> and </Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {error ? (
                <HelperText type="error" visible={!!error}>
                  {error}
                </HelperText>
              ) : null}
              
              <Button
                mode="contained"
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Sign Up
              </Button>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <Button
                mode="outlined"
                icon="google"
                onPress={() => {}}
                style={styles.socialButton}
              >
                Continue with Google
              </Button>
              
              <Button
                mode="outlined"
                icon="facebook"
                onPress={() => {}}
                style={styles.socialButton}
              >
                Continue with Facebook
              </Button>
            </View>
            
            <View style={styles.footer}>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  title: {
    marginTop: 8,
    fontWeight: 'bold',
    color: colors.primary,
  },
  form: {
    marginVertical: 16,
  },
  input: {
    marginBottom: 12,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
    backgroundColor: colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#757575',
  },
  socialButton: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: 'bold',
  },
});
