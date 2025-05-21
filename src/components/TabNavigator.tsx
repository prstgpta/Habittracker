import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabNavigatorProps {
  activeTab: 'home' | 'weekly';
  onTabChange: (tab: 'home' | 'weekly') => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'home' && styles.activeTab]}
        onPress={() => onTabChange('home')}
      >
        <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
          All Habits
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
        onPress={() => onTabChange('weekly')}
      >
        <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
          Weekly View
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#757575',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default TabNavigator;
