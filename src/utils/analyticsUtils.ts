/**
 * Utility functions for habit analytics calculations
 */
import { Habit } from '../context/HabitContext';
import { formatDate, getToday } from './dateUtils';

// Calculate the current streak for a habit
export const getCurrentStreak = (habit: Habit): number => {
  // This is a very simple implementation that avoids any double counting
  
  // First, get all completed dates
  const completedDates = Object.keys(habit.completions)
    .filter(date => habit.completions[date])
    .sort(); // Sort dates in ascending order
  
  if (completedDates.length === 0) {
    return 0;
  }
  
  // Get today's date
  const todayStr = getToday();
  
  // Initialize streak counter
  let streak = 0;
  
  // Check if today is completed
  const todayCompleted = habit.completions[todayStr] || false;
  
  // Create a copy of completedDates without today (if it exists)
  const pastCompletedDates = completedDates.filter(date => date !== todayStr);
  
  // If there are no past completions and today is not completed, return 0
  if (pastCompletedDates.length === 0 && !todayCompleted) {
    return 0;
  }
  
  // If today is completed, we'll count it separately at the end
  // Start by checking the most recent completion before today
  if (pastCompletedDates.length > 0) {
    // Get the most recent completion date (last item in sorted array)
    const lastCompletionDate = new Date(pastCompletedDates[pastCompletedDates.length - 1]);
    
    // If today is not completed, check if the last completion was yesterday
    if (!todayCompleted) {
      const yesterday = new Date(todayStr);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDate(yesterday);
      
      // If the last completion wasn't yesterday, there's no current streak
      if (formatDate(lastCompletionDate) !== yesterdayStr) {
        return 0;
      }
    }
    
    // Count consecutive days backwards from the last completion
    let currentDate = new Date(lastCompletionDate);
    let dateStr = formatDate(currentDate);
    
    // Start counting from the last completion
    while (habit.completions[dateStr]) {
      streak++;
      // Move to the previous day
      currentDate.setDate(currentDate.getDate() - 1);
      dateStr = formatDate(currentDate);
    }
  }
  
  // Add today to the streak if it's completed
  if (todayCompleted) {
    streak += 1;
  }
  
  return streak;
};

// Calculate the longest streak for a habit
export const getLongestStreak = (habit: Habit): number => {
  const dates = Object.keys(habit.completions)
    .filter(date => habit.completions[date])
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  if (dates.length === 0) return 0;
  
  let longestStreak = 0;
  let currentStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    
    // Check if dates are consecutive
    prevDate.setDate(prevDate.getDate() + 1);
    
    if (prevDate.getTime() === currDate.getTime()) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }
  
  // Check the last streak
  longestStreak = Math.max(longestStreak, currentStreak);
  
  return longestStreak;
};

// Calculate the weekly completion rate based on days gone in the current week
export const getWeeklyCompletionRate = (habit: Habit): number => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Get the start of the current week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);
  startOfWeek.setHours(0, 0, 0, 0);
  
  let completed = 0;
  let total = 0;
  
  // Count from start of week to today (inclusive)
  // This gives us only the days gone in the current week
  for (let i = 0; i <= currentDay; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateString = formatDate(date);
    
    // Only count days up to today
    if (date <= today) {
      total++;
      if (habit.completions[dateString]) {
        completed++;
      }
    }
  }
  
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

// Calculate the overall completion rate
export const getOverallCompletionRate = (habit: Habit): number => {
  // Get the creation date of the habit
  const createdAt = new Date(habit.createdAt);
  
  // Ensure the date is valid
  if (isNaN(createdAt.getTime())) {
    console.warn('Invalid creation date for habit:', habit.name);
    return 0;
  }
  
  const today = new Date();
  
  // Calculate days since habit creation (inclusive of today)
  const daysDiff = Math.max(1, Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  
  // Count completed days
  const completedDays = Object.values(habit.completions).filter(Boolean).length;
  
  // Ensure we don't have more completions than days (which would cause percentage > 100%)
  const validCompletedDays = Math.min(completedDays, daysDiff);
  
  // Calculate percentage and ensure it's between 0-100%
  const percentage = Math.min(100, Math.max(0, Math.round((validCompletedDays / daysDiff) * 100)));
  
  return percentage;
};
