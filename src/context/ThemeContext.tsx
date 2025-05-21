import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDarkMode: boolean;
  colors: {
    background: string;
    text: string;
    card: string;
    cardShadow: string;
    border: string;
    placeholder: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  // Load saved theme from AsyncStorage on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Toggle between light and dark theme
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Save theme preference to AsyncStorage
    try {
      await AsyncStorage.setItem('themeMode', newTheme);
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  };
  
  // Define colors based on current theme
  const colors = {
    background: theme === 'light' ? '#F5F5F5' : '#121212',
    text: theme === 'light' ? '#212121' : '#E0E0E0',
    card: theme === 'light' ? '#FFFFFF' : '#1E1E1E',
    cardShadow: theme === 'light' ? '#000000' : '#000000',
    border: theme === 'light' ? '#E0E0E0' : '#333333',
    placeholder: theme === 'light' ? '#9E9E9E' : '#757575',
  };
  
  const isDarkMode = theme === 'dark';
  
  const value = {
    theme,
    toggleTheme,
    isDarkMode,
    colors,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
