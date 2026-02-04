import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { colors, spacing } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SplashAnimation: React.FC<{ onAnimationEnd: () => void }> = ({ onAnimationEnd }) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      // Fade in logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Glow effect
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Draw line
      Animated.timing(lineWidth, {
        toValue: 200,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      // Show subtitle
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Brief pause
      Animated.delay(800),
    ]);

    sequence.start(() => {
      onAnimationEnd();
    });
  }, []);

  return (
    <View style={styles.splashContainer}>
      {/* Background grid lines effect */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLine, styles.gridLineHorizontal, { top: i * 50 }]} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLine, styles.gridLineVertical, { left: i * 50 }]} />
        ))}
      </View>

      <View style={styles.splashContent}>
        {/* Glow behind logo */}
        <Animated.View
          style={[
            styles.glow,
            { opacity: glowOpacity },
          ]}
        />

        {/* Logo */}
        <Animated.Text
          style={[
            styles.splashLogo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          VECTOR
        </Animated.Text>

        {/* Animated line */}
        <Animated.View style={[styles.animatedLine, { width: lineWidth }]} />

        {/* Subtitle */}
        <Animated.Text style={[styles.splashSubtitle, { opacity: subtitleOpacity }]}>
          PREDICTION MARKETS
        </Animated.Text>
      </View>
    </View>
  );
};

const OnboardingSlide: React.FC<{
  title: string;
  description: string;
  icon: string;
  index: number;
  currentIndex: number;
}> = ({ title, description, icon, index, currentIndex }) => {
  const translateX = useRef(new Animated.Value(width)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (index === currentIndex) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (index < currentIndex) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -width,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentIndex, index]);

  return (
    <Animated.View
      style={[
        styles.slide,
        {
          transform: [{ translateX }],
          opacity,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.iconGlow} />
      </View>
      <Text style={styles.slideTitle}>{title}</Text>
      <Text style={styles.slideDescription}>{description}</Text>
    </Animated.View>
  );
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      icon: '📊',
      title: 'EXPLORE MARKETS',
      description: 'Discover prediction markets across tech, economics, crypto, and politics. Make informed decisions based on crowd wisdom.',
    },
    {
      icon: '📰',
      title: 'REAL-TIME NEWS',
      description: 'Stay updated with curated news that impacts market probabilities. Never miss a critical update.',
    },
    {
      icon: '💼',
      title: 'TRACK YOUR PORTFOLIO',
      description: 'Monitor your positions, analyze performance, and optimize your prediction strategy.',
    },
  ];

  useEffect(() => {
    if (!showSplash) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [showSplash]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (showSplash) {
    return <SplashAnimation onAnimationEnd={() => setShowSplash(false)} />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>VECTOR</Text>
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <View style={styles.slidesContainer}>
        {slides.map((slide, index) => (
          <OnboardingSlide
            key={index}
            {...slide}
            index={index}
            currentIndex={currentSlide}
          />
        ))}
      </View>

      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentSlide && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {currentSlide === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
        </Text>
        <Text style={styles.buttonArrow}>→</Text>
      </TouchableOpacity>

      {/* Bottom decoration */}
      <View style={styles.bottomDecoration}>
        <View style={styles.decorLine} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: colors.primary,
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  splashContent: {
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.1,
    top: -70,
  },
  splashLogo: {
    fontFamily: 'monospace',
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 12,
  },
  animatedLine: {
    height: 2,
    backgroundColor: colors.primary,
    marginTop: spacing.md,
    borderRadius: 1,
  },
  splashSubtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    letterSpacing: 4,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.lg,
  },
  logo: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 3,
  },
  skipText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textDim,
    letterSpacing: 2,
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  slide: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  icon: {
    fontSize: 48,
  },
  iconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    opacity: 0.05,
  },
  slideTitle: {
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 3,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  slideDescription: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 300,
    letterSpacing: 0.3,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.background,
    letterSpacing: 2,
  },
  buttonArrow: {
    fontSize: 18,
    color: colors.background,
    fontWeight: 'bold',
  },
  bottomDecoration: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  decorLine: {
    width: 60,
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
  },
});

export default OnboardingScreen;
