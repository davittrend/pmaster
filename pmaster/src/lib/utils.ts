import { format, addMinutes, setHours, setMinutes } from 'date-fns';
import type { PinterestPin } from '../types/pinterest';

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  count: number
): Date[] {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const start = setHours(setMinutes(new Date(), startMinute), startHour);
  const end = setHours(setMinutes(new Date(), endMinute), endHour);
  
  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  const interval = Math.floor(totalMinutes / (count - 1));
  
  return Array.from({ length: count }, (_, i) => 
    addMinutes(start, interval * i)
  );
}

export function validatePinData(pin: Partial<PinterestPin>): string[] {
  const errors: string[] = [];
  
  if (!pin.title?.trim()) {
    errors.push('Title is required');
  } else if (pin.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }
  
  if (pin.description && pin.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }
  
  if (!pin.link?.startsWith('http')) {
    errors.push('Valid URL is required');
  }
  
  if (!pin.imageUrl?.startsWith('https://')) {
    errors.push('Image URL must use HTTPS');
  }
  
  return errors;
}

export function formatScheduleTime(date: Date): string {
  return format(date, 'MMM d, yyyy h:mm a');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}