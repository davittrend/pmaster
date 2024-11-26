import React from 'react';
import { format } from 'date-fns';
import { useAccountStore } from '../store/account';

interface SchedulingControlsProps {
  startDate: Date;
  endDate: Date;
  randomize: boolean;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onRandomizeChange: (randomize: boolean) => void;
}

export function SchedulingControls({
  startDate,
  endDate,
  randomize,
  onStartDateChange,
  onEndDateChange,
  onRandomizeChange,
}: SchedulingControlsProps) {
  const { settings } = useAccountStore();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => onStartDateChange(new Date(e.target.value))}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={(e) => onEndDateChange(new Date(e.target.value))}
            min={format(startDate, 'yyyy-MM-dd')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="randomize"
          checked={randomize}
          onChange={(e) => onRandomizeChange(e.target.checked)}
          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
        />
        <label htmlFor="randomize" className="ml-2 block text-sm text-gray-700">
          Randomize posting times between {settings.preferredTimeStart} and {settings.preferredTimeEnd}
        </label>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-600">
          Daily pin limit: {settings.dailyPinLimit} pins
        </p>
        <p className="text-sm text-gray-600">
          Timezone: {settings.timezone}
        </p>
      </div>
    </div>
  );
}