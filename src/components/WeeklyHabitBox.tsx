import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Habit } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { formatDate, getDayShortName, isToday } from '../utils/dateUtils';

interface WeeklyHabitBoxProps {
  habit: Habit;
  allWeeks: Date[][];
  onToggleCompletion: (habitId: string, date: string) => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
}

const WeeklyHabitBox: React.FC<WeeklyHabitBoxProps> = ({
  habit,
  allWeeks,
  onToggleCompletion,
  onEditHabit,
  onDeleteHabit,
}) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const { colors } = useTheme();
  
  // Get theme color based on habit theme
  const themeColor = {
    primary: habit.theme === 'red' ? '#FF5252' : habit.theme === 'blue' ? '#2196F3' : '#4CAF50',
    secondary: habit.theme === 'red' ? '#FFCDD2' : habit.theme === 'blue' ? '#BBDEFB' : '#C8E6C9',
  };
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    if (currentWeekIndex < allWeeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };
  
  // Get the current week to display
  // We'll sort the week array to show Sunday on the left and Saturday on the right
  const currentWeek = [...(allWeeks[currentWeekIndex] || allWeeks[0])].sort((a, b) => {
    // Sort by day of week (0 = Sunday, 6 = Saturday)
    return a.getDay() - b.getDay();
  });
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.cardShadow, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
      </View>
      
      <View style={styles.weekContainer}>
        <View style={styles.navigationRow}>
          <TouchableOpacity 
            style={[styles.navButton, currentWeekIndex === 0 && styles.disabledButton]}
            onPress={goToPreviousWeek}
            disabled={currentWeekIndex === 0}
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={[styles.weekText, { color: colors.text }]}>
            Week {currentWeekIndex + 1} of {allWeeks.length}
          </Text>
          
          <TouchableOpacity 
            style={[styles.navButton, currentWeekIndex === allWeeks.length - 1 && styles.disabledButton]}
            onPress={goToNextWeek}
            disabled={currentWeekIndex === allWeeks.length - 1}
          >
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekContent}>
          {/* Edit and Delete buttons positioned on the left */}
          <View style={styles.actionButtonsContainer}>
            {onEditHabit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEditHabit(habit)}
              >
                <Text style={styles.actionIcon}>✏️</Text>
              </TouchableOpacity>
            )}
            
            {onDeleteHabit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDeleteHabit(habit.id)}
              >
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.daysContainer}>
            <View style={styles.dayLabelsRow}>
              {currentWeek.map((date, index) => (
                <Text key={`label-${index}`} style={[styles.dayLabel, { color: colors.text }]}>
                  {getDayShortName(date)}
                </Text>
              ))}
            </View>
            
            <View style={styles.dotsRow}>
              {currentWeek.map((date, index) => {
                const dateStr = formatDate(date);
                const isCompleted = habit.completions[dateStr];
                
                // Always make dots interactive in the weekly view
                return (
                  <TouchableOpacity
                    key={`dot-${index}`}
                    style={[
                      styles.dot,
                      isToday(date) && styles.todayDot,
                      isCompleted && { backgroundColor: themeColor.primary },
                    ]}
                    onPress={() => onToggleCompletion(habit.id, dateStr)}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 12,
    width: '100%',
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    marginLeft: 8,
  },
  actionIcon: {
    fontSize: 16,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  navButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekContainer: {
    width: '100%',
  },
  weekContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 10,
  },
  daysContainer: {
    flex: 1,
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 5, // Reduced by 3pt from 8
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: 30,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 5, // Reduced by 3pt from 8
  },
  dot: {
    width: 17, // Reduced by ~30% from 24px
    height: 17, // Reduced by ~30% from 24px
    borderRadius: 8.5,
    backgroundColor: '#E0E0E0',
    margin: 3, // Set to 3pt for both horizontal and vertical spacing
  },
  todayDot: {
    borderWidth: 2,
    borderColor: '#FF4081', // Pink color for better visibility in both light and dark modes
  },

  weekText: {
    fontSize: 14,
    color: '#757575',
  },
});

export default WeeklyHabitBox;
