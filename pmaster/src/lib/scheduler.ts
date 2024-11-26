import { addDays, differenceInDays, setHours, setMinutes } from 'date-fns';
import { PinterestPin } from '../types/pinterest';

interface SchedulerOptions {
  startDate: Date;
  endDate: Date;
  dailyPinLimit: number;
  preferredTimeStart: string;
  preferredTimeEnd: string;
  randomize: boolean;
}

export function schedulePins(pins: PinterestPin[], options: SchedulerOptions): PinterestPin[] {
  const {
    startDate,
    endDate,
    dailyPinLimit,
    preferredTimeStart,
    preferredTimeEnd,
    randomize,
  } = options;

  const totalDays = differenceInDays(endDate, startDate) + 1;
  const [startHour, startMinute] = preferredTimeStart.split(':').map(Number);
  const [endHour, endMinute] = preferredTimeEnd.split(':').map(Number);

  const getTimeForPin = (day: number, pinIndex: number): Date => {
    const date = addDays(startDate, day);
    
    if (randomize) {
      const startTime = setHours(setMinutes(date, startMinute), startHour).getTime();
      const endTime = setHours(setMinutes(date, endMinute), endHour).getTime();
      return new Date(startTime + Math.random() * (endTime - startTime));
    } else {
      const timeSlotDuration = (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / dailyPinLimit;
      const pinTime = startHour * 60 + startMinute + (pinIndex * timeSlotDuration);
      return setHours(setMinutes(date, pinTime % 60), Math.floor(pinTime / 60));
    }
  };

  const scheduledPins: PinterestPin[] = [];
  let currentDay = 0;
  let dailyCount = 0;

  for (const pin of pins) {
    if (currentDay >= totalDays) break;

    const scheduledTime = getTimeForPin(currentDay, dailyCount);
    scheduledPins.push({ ...pin, scheduledTime });

    dailyCount++;
    if (dailyCount >= dailyPinLimit) {
      dailyCount = 0;
      currentDay++;
    }
  }

  return scheduledPins;
}