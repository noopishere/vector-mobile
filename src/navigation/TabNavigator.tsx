import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { MarketsScreen } from '../screens/MarketsScreen';
import { FeedScreen } from '../screens/FeedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MarketDetailScreen } from '../screens/MarketDetailScreen';
import { NewsDetailScreen } from '../screens/NewsDetailScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const MarketsStack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Simple icon components (black & white)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>
      {name === 'Markets' ? '◈' : name === 'Feed' ? '◉' : '○'}
    </Text>
  </View>
);

const MarketsStackScreen = () => (
  <MarketsStack.Navigator screenOptions={{ headerShown: false }}>
    <MarketsStack.Screen name="MarketsHome" component={MarketsScreen} />
    <MarketsStack.Screen name="MarketDetail" component={MarketDetailScreen} />
    <MarketsStack.Screen name="NewsDetail" component={NewsDetailScreen} />
  </MarketsStack.Navigator>
);

const FeedStackScreen = () => (
  <FeedStack.Navigator screenOptions={{ headerShown: false }}>
    <FeedStack.Screen name="FeedHome" component={FeedScreen} />
    <FeedStack.Screen name="NewsDetail" component={NewsDetailScreen} />
    <FeedStack.Screen name="MarketDetail" component={MarketDetailScreen} />
  </FeedStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    <ProfileStack.Screen name="MarketDetail" component={MarketDetailScreen} />
  </ProfileStack.Navigator>
);

export const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.gray[600],
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="Markets"
          component={MarketsStackScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Markets" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedStackScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Feed" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.black,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: colors.gray[600],
  },
  iconFocused: {
    color: colors.white,
  },
});
