import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useHabits, Habit } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { getPast104Weeks } from '../utils/dateUtils';
import WeeklyHabitBox from '../components/WeeklyHabitBox';
import EditHabitModal from '../components/EditHabitModal';
import AddHabitModal from '../components/AddHabitModal';
import SettingsModal from '../components/SettingsModal';

const WeeklyScreen: React.FC = () => {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitCompletion } = useHabits();
  const { colors, isDarkMode } = useTheme();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsEditModalVisible(true);
  };
  
  const handleDeleteHabit = (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => deleteHabit(habitId),
          style: 'destructive'
        },
      ]
    );
  };
  
  // Get dates for the past 104 weeks
  const allWeeks = getPast104Weeks();
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Weekly View</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setIsSettingsModalVisible(true)}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+ Add Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.content}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                No habits yet. Tap the "Add Habit" button to get started!
              </Text>
            </View>
          ) : (
            habits.map(habit => (
              <WeeklyHabitBox
                key={habit.id}
                habit={habit}
                allWeeks={allWeeks}
                onToggleCompletion={toggleHabitCompletion}
                onEditHabit={handleEditHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            ))
          )}
        </ScrollView>
        
        <EditHabitModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onUpdateHabit={updateHabit}
          onDeleteHabit={deleteHabit}
          habit={selectedHabit}
        />
        
        <AddHabitModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAddHabit={addHabit}
        />
        
        <SettingsModal
          visible={isSettingsModalVisible}
          onClose={() => setIsSettingsModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10, // Add top margin for better spacing
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    marginRight: 10,
    padding: 5,
  },
  settingsIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#757575',
  },
});

export default WeeklyScreen;
