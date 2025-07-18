import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { supabase } from '../utils/supabase';
import { colors } from '../utils/theme';
import i18n from '../utils/i18n';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });
      
      if (error) {
        setError(error.message || 'Failed to send reset password email');
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>❤️ DateMate</Text>
          <Text variant="headlineLarge" style={styles.title}>Reset Password</Text>
        </View>
        
        {!success ? (
          <View style={styles.form}>
            <Text style={styles.instructions}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            
            {error ? (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            ) : null}
            
            <Button
              mode="contained"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Send Reset Link
            </Button>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Password reset email sent! Check your inbox for a link to reset your password.
            </Text>
            
            <Button
              mode="contained"
              onPress={() => router.push('/(auth)/login')}
              style={styles.button}
            >
              Back to Login
            </Button>
          </View>
        )}
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.backText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  form: {
    marginVertical: 24,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#757575',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
    backgroundColor: colors.primary,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 24,
    color: colors.success,
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    color: colors.primary,
  },
});
