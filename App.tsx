import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, View, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { TabNavigator } from './src/navigation/TabNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

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
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      if (value === 'true') {
        setShowOnboarding(false);
      }
    } catch {
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
  const { isLoading: onboardingLoading, showOnboarding, completeOnboarding } = useOnboardingState();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !onboardingLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, onboardingLoading]);

  if (!fontsLoaded || onboardingLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#000000" />
        <View style={styles.loadingContainer} />
      </SafeAreaProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <StatusBar style="light" backgroundColor="#000000" />
          <TransitionWrapper
            showOnboarding={showOnboarding}
            onComplete={completeOnboarding}
          />
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
