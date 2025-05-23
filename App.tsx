/**
 * Habit Tracker App
 * Created: May 21, 2025
 * 
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HabitProvider } from './src/context/HabitContext';
import { ThemeProvider } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import WeeklyScreen from './src/screens/WeeklyScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import TabNavigator from './src/components/TabNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<'home' | 'weekly' | 'analytics'>('home');

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HabitProvider>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={styles.safeArea.backgroundColor}
            />
            
            <View style={styles.container}>
              <View style={{ display: activeTab === 'home' ? 'flex' : 'none', flex: 1 }}>
                <HomeScreen />
              </View>
              <View style={{ display: activeTab === 'weekly' ? 'flex' : 'none', flex: 1 }}>
                <WeeklyScreen />
              </View>
              <View style={{ display: activeTab === 'analytics' ? 'flex' : 'none', flex: 1 }}>
                <AnalyticsScreen />
              </View>
            </View>
            
            <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
          </SafeAreaView>
        </HabitProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Calculate status bar height for different platforms
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: STATUSBAR_HEIGHT, // Add padding for status bar
  },
  container: {
    flex: 1,
  },
});

export default App;
