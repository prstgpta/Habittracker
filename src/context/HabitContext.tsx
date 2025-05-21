import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
export type HabitTheme = 'red' | 'blue' | 'green';

export interface Habit {
  id: string;
  name: string;
  theme: HabitTheme;
  createdAt: string;
  completions: Record<string, boolean>; // Format: 'YYYY-MM-DD': true/false
  order: number;
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string, theme: HabitTheme) => void;
  updateHabit: (habit: Habit) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
  reorderHabits: (startIndex: number, endIndex: number) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from AsyncStorage when the component mounts
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        }
      } catch (error) {
        console.error('Failed to load habits from storage', error);
      }
    };

    loadHabits();
  }, []);

  // Save habits to AsyncStorage whenever they change
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits to storage', error);
      }
    };

    saveHabits();
  }, [habits]);

  // Add a new habit
  const addHabit = (name: string, theme: HabitTheme) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      theme,
      createdAt: new Date().toISOString(),
      completions: {},
      order: habits.length,
    };

    setHabits([...habits, newHabit]);
  };

  // Update an existing habit
  const updateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
  };

  // Toggle completion status for a habit on a specific date
  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const updatedCompletions = { ...habit.completions };
        updatedCompletions[date] = !updatedCompletions[date];
        
        return {
          ...habit,
          completions: updatedCompletions,
        };
      }
      return habit;
    }));
  };

  // Delete a habit
  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  // Reorder habits (for drag and drop functionality)
  const reorderHabits = (startIndex: number, endIndex: number) => {
    const result = Array.from(habits);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Update order property for each habit
    const updatedHabits = result.map((habit, index) => ({
      ...habit,
      order: index,
    }));

    setHabits(updatedHabits);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        toggleHabitCompletion,
        deleteHabit,
        reorderHabits,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to use the habit context
export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
