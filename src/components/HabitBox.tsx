import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Habit } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { formatDate, isToday } from '../utils/dateUtils';

interface HabitBoxProps {
  habit: Habit;
  dates: Date[][];
  onToggleCompletion: (habitId: string, date: string) => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
  showCheckbox?: boolean;
  visibleWeeks?: number; // Default will be set to 104
  interactiveDots?: boolean;
}

const HabitBox: React.FC<HabitBoxProps> = ({
  habit,
  dates,
  onToggleCompletion,
  onEditHabit,
  onDeleteHabit,
  showCheckbox = true,
  visibleWeeks = 104,
  interactiveDots = false,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const { colors } = useTheme();
  
  // Get theme color based on habit theme
  const themeColor = {
    primary: habit.theme === 'red' ? '#FF5252' : habit.theme === 'blue' ? '#2196F3' : '#4CAF50',
    secondary: habit.theme === 'red' ? '#FFCDD2' : habit.theme === 'blue' ? '#BBDEFB' : '#C8E6C9',
  };
  
  // Calculate the visible dates (limit to the specified number of visible weeks)
  // Reverse the order of dates to show the latest week on the right
  const visibleDates = dates.slice(0, visibleWeeks).reverse();
  
  // Create a ref for the ScrollView to scroll to the end (latest week) on mount
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Scroll to the end (right side) when the component mounts or when visibleDates changes
  useEffect(() => {
    // Use a small timeout to ensure the ScrollView has rendered with its content
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [visibleDates.length]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.cardShadow, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
        
        <View style={styles.actionsContainer}>
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
          
          {showCheckbox && (
            <TouchableOpacity
              style={[styles.checkbox, { borderColor: themeColor.primary }]}
              onPress={() => onToggleCompletion(habit.id, formatDate(new Date()))}
            >
              {habit.completions[formatDate(new Date())] && (
                <View style={[styles.checkboxInner, { backgroundColor: themeColor.primary }]} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.habitHistoryContainer}>
        <ScrollView 
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {visibleDates.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.weekColumn}>
              {/* Reverse the days array to show the latest day on the right */}
              {[...week].reverse().map((date, dayIndex) => {
                const dateStr = formatDate(date);
                const isCompleted = habit.completions[dateStr];
                
                // Use TouchableOpacity for interactive dots, View for non-interactive dots
                return interactiveDots ? (
                  <TouchableOpacity
                    key={`day-${weekIndex}-${dayIndex}`}
                    style={[
                      styles.dot,
                      isToday(date) && styles.todayDot,
                      isCompleted && { backgroundColor: themeColor.primary },
                    ]}
                    onPress={() => onToggleCompletion(habit.id, dateStr)}
                  />
                ) : (
                  <View
                    key={`day-${weekIndex}-${dayIndex}`}
                    style={[
                      styles.dot,
                      isToday(date) && styles.todayDot,
                      isCompleted && { backgroundColor: themeColor.primary },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 11, // Reduced by 5pt from 16
    paddingBottom: 11, // Reduced by 5pt from 16
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
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  habitHistoryContainer: {
    height: 140,  // Increased height to accommodate larger dots
    marginBottom: 8,
  },
  scrollContentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  weekColumn: {
    flexDirection: 'column',
    marginRight: 9,  // Reduced by 3pt from 12
    justifyContent: 'space-between',
    height: 132,  // Increased height to accommodate larger dots
  },
  dot: {
    width: 16, // Increased by twice from 8px
    height: 16, // Increased by twice from 8px
    borderRadius: 8, // Half of width/height to maintain circular shape
    backgroundColor: '#E0E0E0',
    margin: 3, // Maintained 3pt spacing
  },
  todayDot: {
    borderWidth: 2,
    borderColor: '#FF4081', // Pink color for better visibility in both light and dark modes
  },
});

export default HabitBox;
