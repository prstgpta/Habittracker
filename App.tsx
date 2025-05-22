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
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HabitProvider } from './src/context/HabitContext';
import { ThemeProvider } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import WeeklyScreen from './src/screens/WeeklyScreen';
import TabNavigator from './src/components/TabNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<'home' | 'weekly'>('home');

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
            </View>
            
            <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
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
  container: {
    flex: 1,
  },
});

export default App;
