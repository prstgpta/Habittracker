/**
 * Utility functions for habit analytics calculations
 */
import { Habit } from '../context/HabitContext';
import { formatDate, getToday } from './dateUtils';

// Calculate the current streak for a habit
export const getCurrentStreak = (habit: Habit): number => {
  // Get all completed dates
  const completedDates = Object.keys(habit.completions)
    .filter(date => habit.completions[date])
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime()); // Sort in descending order (newest first)
  
  if (completedDates.length === 0) {
    return 0;
  }
  
  // Get today's date
  const today = new Date(getToday());
  
  // Check if the streak includes today
  let streakIncludesToday = false;
  let startingDate = null;
  
  // Check if today is completed
  if (habit.completions[getToday()]) {
    streakIncludesToday = true;
    startingDate = today;
  } else {
    // If today is not completed, check if yesterday is in the completed dates
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    
    if (habit.completions[yesterdayStr]) {
      startingDate = yesterday;
    } else {
      // No current streak if neither today nor yesterday is completed
      return 0;
    }
  }
  
  // Count consecutive days
  let streak = 0;
  let currentDate = new Date(startingDate);
  
  // Keep going back one day at a time as long as days are completed
  while (true) {
    const dateStr = formatDate(currentDate);
    
    if (habit.completions[dateStr]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate the longest streak for a habit
export const getLongestStreak = (habit: Habit): number => {
  // Get all completed dates
  const completedDates = Object.keys(habit.completions)
    .filter(date => habit.completions[date])
    .map(date => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime()); // Sort in ascending order
  
  if (completedDates.length === 0) {
    return 0;
  }
  
  // If there's only one completion, the longest streak is 1
  if (completedDates.length === 1) {
    return 1;
  }
  
  let longestStreak = 0;
  let currentStreak = 1; // Start with 1 for the first date
  
  // Loop through the sorted dates to find consecutive days
  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i-1]);
    const currDate = new Date(completedDates[i]);
    
    // Calculate the difference in days between the current date and previous date
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // If the difference is exactly 1 day, the dates are consecutive
    if (diffDays === 1) {
      currentStreak++;
    } else {
      // If not consecutive, check if this streak is the longest so far
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1; // Reset streak counter
    }
  }
  
  // Check if the final streak is the longest
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
