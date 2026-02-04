import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '../theme/colors';

import NewsScreen from '../screens/NewsScreen';
import MarketsScreen from '../screens/MarketsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabIcon: React.FC<{ label: string; focused: boolean }> = ({ label, focused }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>{label}</Text>
  </View>
);

export const TabNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textDim,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="📰" focused={focused} />,
            tabBarLabel: 'NEWS',
          }}
        />
        <Tab.Screen
          name="Markets"
          component={MarketsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} />,
            tabBarLabel: 'MARKETS',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} />,
            tabBarLabel: 'SETTINGS',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
  },
  tabBarLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
});

export default TabNavigator;
