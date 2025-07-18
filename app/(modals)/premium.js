import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../../assets/app-logo';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

export default function PremiumScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  
  const plans = [
    {
      id: 'monthly',
      title: '1 Month',
      price: '$19.99',
      perMonth: '$19.99/mo',
      savings: null,
      popular: false,
    },
    {
      id: 'biannual',
      title: '6 Months',
      price: '$89.99',
      perMonth: '$15.00/mo',
      savings: 'Save 25%',
      popular: true,
    },
    {
      id: 'annual',
      title: '12 Months',
      price: '$149.99',
      perMonth: '$12.50/mo',
      savings: 'Save 37%',
      popular: false,
    }
  ];
  
  const features = [
    {
      icon: 'location',
      title: 'Location Change',
      description: 'Match with people anywhere in the world'
    },
    {
      icon: 'heart',
      title: 'Unlimited Likes',
      description: 'Never run out of likes again'
    },
    {
      icon: 'eye',
      title: 'See Who Likes You',
      description: 'See all your admirers in one place'
    },
    {
      icon: 'star',
      title: '5 Super Likes / day',
      description: 'Stand out with Super Likes'
    },
    {
      icon: 'refresh',
      title: 'Rewind Last Swipe',
      description: 'Accidentally passed? No problem'
    },
    {
      icon: 'flash',
      title: '1 Free Boost / month',
      description: 'Get more views for 30 minutes'
    }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <AppLogo width={100} height={40} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <LinearGradient
          colors={['#FF7B69', '#FF4458']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.headerBanner}
        >
          <Text style={styles.headerTitle}>Premium</Text>
          <Text style={styles.headerSubtitle}>Unlock all the features</Text>
        </LinearGradient>
        
        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.plansScrollView}
          >
            {plans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedPlan,
                  plan.popular && styles.popularPlan
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>POPULAR</Text>
                  </View>
                )}
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPerMonth}>{plan.perMonth}</Text>
                {plan.savings && (
                  <Text style={styles.planSavings}>{plan.savings}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <LinearGradient
                colors={['#FF7B69', '#FF4458']}
                style={styles.featureIconContainer}
              >
                <Ionicons name={feature.icon} size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={() => router.back()}
        >
          <LinearGradient
            colors={['#FF7B69', '#FF4458']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientButton}
          >
            <Text style={styles.subscribeButtonText}>
              CONTINUE
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          Payment will be charged to your App Store account at confirmation of purchase. 
          Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
        </Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    top: 10,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerBanner: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  plansScrollView: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  planCard: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedPlan: {
    borderColor: '#FF4458',
    backgroundColor: 'rgba(255, 68, 88, 0.1)',
  },
  popularPlan: {
    borderColor: '#ffc107',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
  },
  popularBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4,
  },
  planPerMonth: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  planSavings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
  featuresContainer: {
    paddingHorizontal: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#ccc',
  },
  footer: {
    padding: 16,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  subscribeButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
});
