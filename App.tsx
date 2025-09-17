import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import { LoginScreen } from './src/screens/LoginScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { AdviceScreen } from './src/screens/AdviceScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';


import { registerForPushNotificationsAsync } from './src/services/notifications';

import './src/locales/i18n';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Tasks') {
            iconName = focused ? 'format-list-checkbox' : 'format-list-checks';
          } else if (route.name === 'Advice') {
            iconName = focused ? 'lightbulb' : 'lightbulb-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDarkMode ? '#90cdf4' : '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        },
        headerTintColor: isDarkMode ? '#ffffff' : '#000000',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        },
      })}
    >
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{ title: t('tasks') }}
      />
      <Tab.Screen 
        name="Advice" 
        component={AdviceScreen} 
        options={{ title: t('advice') }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: t('settings') }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}