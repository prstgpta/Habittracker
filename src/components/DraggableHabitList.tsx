import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Habit } from '../context/HabitContext';
import HabitBox from './HabitBox';

interface DraggableHabitListProps {
  habits: Habit[];
  dates: Date[][];
  onToggleCompletion: (habitId: string, date: string) => void;
  onReorderHabits: (startIndex: number, endIndex: number) => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
}

// No need for HABIT_HEIGHT constant in the simplified version

const DraggableHabitList: React.FC<DraggableHabitListProps> = ({
  habits,
  dates,
  onToggleCompletion,
  onReorderHabits,
  onEditHabit,
  onDeleteHabit,
}) => {
  const [editMode, setEditMode] = useState(false);

  // Function to move a habit up in the list
  const moveHabitUp = (index: number) => {
    if (index > 0) {
      onReorderHabits(index, index - 1);
    }
  };

  // Function to move a habit down in the list
  const moveHabitDown = (index: number) => {
    if (index < habits.length - 1) {
      onReorderHabits(index, index + 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {habits.map((habit, index) => (
          <View key={habit.id} style={styles.habitWrapper}>
            <HabitBox
              habit={habit}
              dates={dates}
              onToggleCompletion={onToggleCompletion}
              onEditHabit={onEditHabit}
              onDeleteHabit={onDeleteHabit}
              interactiveDots={false}
              visibleWeeks={104}
            />
            {editMode && (
              <View style={styles.reorderButtons}>
                <TouchableOpacity 
                  style={[styles.reorderButton, index === 0 && styles.disabledButton]}
                  onPress={() => moveHabitUp(index)}
                  disabled={index === 0}
                >
                  <View style={styles.arrowUp} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.reorderButton, index === habits.length - 1 && styles.disabledButton]}
                  onPress={() => moveHabitDown(index)}
                  disabled={index === habits.length - 1}
                >
                  <View style={styles.arrowDown} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      {habits.length > 1 && (
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setEditMode(!editMode)}
        >
          <Text style={styles.editButtonInner}>
            {editMode ? 'Done' : 'Reorder Habits'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  habitWrapper: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
  },
  reorderButtons: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -40,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 80,
  },
  reorderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  arrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#2196F3',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  editButtonInner: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DraggableHabitList;
