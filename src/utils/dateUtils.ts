/**
 * Utility functions for date operations in the habit tracker app
 */

// Format a date to YYYY-MM-DD string
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get today's date formatted as YYYY-MM-DD
export const getToday = (): string => {
  return formatDate(new Date());
};

// Get an array of dates for the current week (Sunday to Saturday)
export const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Calculate the date of Sunday (start of the week)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - day);
  
  // Generate dates for the entire week
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};

// Get dates for a specific week, given a date within that week
export const getWeekDates = (date: Date): Date[] => {
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(sunday);
    weekDate.setDate(sunday.getDate() + i);
    weekDates.push(weekDate);
  }
  
  return weekDates;
};

// Get dates for a specific number of weeks, starting from a date
export const getMultiWeekDates = (startDate: Date, numWeeks: number): Date[][] => {
  const weeks: Date[][] = [];
  
  for (let i = 0; i < numWeeks; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - (7 * i));
    weeks.push(getWeekDates(date));
  }
  
  return weeks;
};

// Get short day name (Mon, Tue, etc.)
export const getDayShortName = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Get dates for the past 104 weeks (2 years)
export const getPast104Weeks = (): Date[][] => {
  const today = new Date();
  return getMultiWeekDates(today, 104);
};
