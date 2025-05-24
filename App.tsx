/**
 * Habit Tracker App
 * Created: May 21, 2025
 * 
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HabitProvider } from './src/context/HabitContext';
import { ThemeProvider } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import WeeklyScreen from './src/screens/WeeklyScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import TabNavigator from './src/components/TabNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<'home' | 'weekly' | 'analytics'>('home');

  // Set status bar configuration
  useEffect(() => {
    // Make status bar transparent on Android
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <ThemeProvider>
        <HabitProvider>
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
            
            <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
              <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
            </SafeAreaView>
          </SafeAreaView>
        </HabitProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  bottomSafeArea: {
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
});

export default App;
