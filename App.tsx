import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, View, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabNavigator } from './src/navigation/TabNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_KEY = '@vector_onboarding_complete';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
      gcTime: 300000,
    },
  },
});

// Simple in-memory storage fallback when AsyncStorage isn't available
let hasSeenOnboarding = false;

const useOnboardingState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // Try to use AsyncStorage if available
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      if (value === 'true') {
        setShowOnboarding(false);
      }
    } catch {
      // Fallback to in-memory
      if (hasSeenOnboarding) {
        setShowOnboarding(false);
      }
    }
    setIsLoading(false);
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    } catch {
      // Fallback to in-memory
      hasSeenOnboarding = true;
    }
    setShowOnboarding(false);
  };

  return { isLoading, showOnboarding, completeOnboarding };
};

const TransitionWrapper: React.FC<{
  showOnboarding: boolean;
  onComplete: () => void;
}> = ({ showOnboarding, onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showMain, setShowMain] = useState(false);

  const handleOnboardingComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMain(true);
      onComplete();
      // Fade in main app
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  if (showOnboarding && !showMain) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TabNavigator />
    </Animated.View>
  );
};

export default function App() {
  const { isLoading, showOnboarding, completeOnboarding } = useOnboardingState();

  if (isLoading) {
    // Simple loading state - the splash animation handles the visual
    return (
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0a0a0a" />
        <View style={styles.loadingContainer} />
      </SafeAreaProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0a0a0a" />
        <TransitionWrapper
          showOnboarding={showOnboarding}
          onComplete={completeOnboarding}
        />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
