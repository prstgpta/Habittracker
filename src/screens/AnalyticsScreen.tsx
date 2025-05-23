import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useHabits, Habit } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import {
  getCurrentStreak,
  getLongestStreak,
} from '../utils/analyticsUtils';

const AnalyticsScreen: React.FC = () => {
  const { habits } = useHabits();
  const { colors } = useTheme();

  const renderHabitStats = ({ item: habit }: { item: Habit }) => {
    const currentStreak = getCurrentStreak(habit);
    const longestStreak = getLongestStreak(habit);

    // Get theme color based on habit theme (matching WeeklyHabitBox)
    const themeColor = {
      primary: habit.theme === 'red' ? '#FF5252' : habit.theme === 'blue' ? '#2196F3' : '#4CAF50',
      secondary: habit.theme === 'red' ? '#FFCDD2' : habit.theme === 'blue' ? '#BBDEFB' : '#C8E6C9',
    };

    return (
      <View style={[
        styles.habitCard, 
        { 
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow,
          borderWidth: 2,
          borderColor: themeColor.secondary,
        }
      ]}>
        <View style={styles.headerRow}>
          <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColor.primary }]}>{currentStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Current Streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColor.primary }]}>{longestStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Longest Streak</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Habit Analytics</Text>
      
      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No habits to analyze yet. Add some habits to see statistics.
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabitStats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10, // Add top margin for better spacing
  },
  listContainer: {
    paddingBottom: 16,
  },
  habitCard: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 5, // Changed to 5px for consistency across all screens
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statItem: {
    alignItems: 'center',
    width: '50%',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AnalyticsScreen;
