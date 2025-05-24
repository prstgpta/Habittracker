import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, useWindowDimensions } from 'react-native';
import { Habit } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { formatDate, getDayShortName, isToday, formatDateShort } from '../utils/dateUtils';

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
  // Start with index 0 which represents the current week (week 2 in the UI)
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  
  // Calculate dynamic dot size based on screen width
  // Reserve space for navigation controls and padding
  const navigationControlsWidth = 150; // Approximate width for date range and arrows
  const containerPadding = 32; // Left and right padding (16px each)
  const dotSpacing = 2; // Total horizontal space between dots (1px on each side)
  
  // Available width for dots = screen width - (navigation controls + padding)
  const availableWidth = screenWidth - navigationControlsWidth - containerPadding;
  
  // Calculate dot size (7 dots for 7 days of the week)
  // Subtract total spacing between dots (6 spaces * 2px)
  const calculatedDotSize = Math.floor((availableWidth - (6 * dotSpacing)) / 7);
  
  // Ensure dot size is at least 10px and at most 17px
  const dotSize = Math.max(10, Math.min(17, calculatedDotSize));
  
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
  
  // Get the first and last date of the current week for the date range display
  const firstDate = currentWeek[0];
  const lastDate = currentWeek[6];
  const dateRange = `${formatDateShort(firstDate)} - ${formatDateShort(lastDate)}`;
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card, 
        shadowColor: colors.cardShadow,
        borderWidth: 2,
        borderColor: themeColor.secondary,
      }
    ]}>
      <View style={styles.headerRow}>
        <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
        
        {/* No edit button in Weekly View */}
        <View style={styles.actionButtons}>
          {/* Edit button removed */}
        </View>
      </View>
      
      {/* Combined row for navigation controls and dots */}
      <View style={styles.controlsRow}>
        {/* Left side: Navigation controls */}
        <View style={styles.navigationControls}>
          <TouchableOpacity 
            style={[styles.navTriangle, currentWeekIndex === allWeeks.length - 1 && styles.disabledButton]}
            onPress={goToNextWeek}
            disabled={currentWeekIndex === allWeeks.length - 1}
          >
            <Text style={styles.triangleText}>◀</Text>
          </TouchableOpacity>
          
          <Text style={[styles.dateRangeText, { color: colors.text }]}>
            {dateRange}
          </Text>
          
          <TouchableOpacity 
            style={[styles.navTriangle, currentWeekIndex === 0 && styles.disabledButton]}
            onPress={goToPreviousWeek}
            disabled={currentWeekIndex === 0}
          >
            <Text style={styles.triangleText}>▶</Text>
          </TouchableOpacity>
        </View>
        
        {/* Right side: Dots only */}
        <View style={styles.rightControls}>
          {/* Dots row */}
          <View style={styles.dotsRow}>
            {currentWeek.map((date, index) => {
              const dateStr = formatDate(date);
              const isCompleted = habit.completions[dateStr];
              
              return (
                <TouchableOpacity
                  key={`dot-${index}`}
                  style={[
                    styles.dot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                    },
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingTop: 10, // Reduced from 16
    paddingBottom: 5, // Changed to 5px for consistency across all screens
    paddingHorizontal: 16,
    marginBottom: 12, // Reduced from 16
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
    marginBottom: 6, // Reduced from 10
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6, // Increased from 4
    marginLeft: 0,
    marginRight: 6, // Increased from 4
  },
  actionIcon: {
    fontSize: 20, // Increased from 16
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  navigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 0,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTriangle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  triangleText: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: '900',
  },
  dateRangeText: {
    fontSize: 14,
    color: '#757575',
    marginHorizontal: 8,
  },
  dotsContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 0, // Reduced by 5pt from 5
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
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    marginLeft: 4,
  },
  dot: {
    // Width, height, and borderRadius now set dynamically
    backgroundColor: '#E0E0E0',
    marginVertical: 2,
    marginHorizontal: 1, // Ensures 2px horizontal distance between dots
  },
  todayDot: {
    backgroundColor: '#A0A0A0', // Darker shade of grey for today's dot (matching HabitBox)
  },

  weekText: {
    fontSize: 14,
    color: '#757575',
    marginHorizontal: 8,
  },
});

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(WeeklyHabitBox);
