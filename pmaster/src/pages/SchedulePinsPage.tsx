import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useAuthStore } from '../store/auth';
import { useAccountStore } from '../store/account';
import { BoardSelector } from '../components/BoardSelector';
import { PinUploader } from '../components/PinUploader';
import { SchedulingControls } from '../components/SchedulingControls';
import { PinPreview } from '../components/PinPreview';
import { createPin } from '../lib/api';
import { schedulePins } from '../lib/scheduler';
import type { PinterestPin } from '../types/pinterest';

export function SchedulePinsPage() {
  const { auth } = useAuthStore();
  const { settings } = useAccountStore();
  const [selectedBoard, setSelectedBoard] = useState('');
  const [pins, setPins] = useState<PinterestPin[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [randomize, setRandomize] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedulingProgress, setSchedulingProgress] = useState(0);

  const createPinMutation = useMutation(
    (pin: PinterestPin) => createPin(auth!.access_token, pin),
    {
      onError: (error) => {
        console.error('Failed to create pin:', error);
      },
    }
  );

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const handlePinsLoaded = (loadedPins: PinterestPin[]) => {
    setPins(loadedPins.map(pin => ({ ...pin, boardId: selectedBoard })));
  };

  const handleSchedule = async () => {
    if (!auth || pins.length === 0) return;

    setIsScheduling(true);
    setSchedulingProgress(0);

    try {
      const scheduledPins = schedulePins(pins, {
        startDate,
        endDate,
        dailyPinLimit: settings.dailyPinLimit,
        preferredTimeStart: settings.preferredTimeStart,
        preferredTimeEnd: settings.preferredTimeEnd,
        randomize,
      });

      for (let i = 0; i < scheduledPins.length; i++) {
        await createPinMutation.mutateAsync(scheduledPins[i]);
        setSchedulingProgress(((i + 1) / scheduledPins.length) * 100);
      }

      // Clear form after successful scheduling
      setPins([]);
      setSelectedBoard('');
    } catch (error) {
      console.error('Failed to schedule pins:', error);
    } finally {
      setIsScheduling(false);
      setSchedulingProgress(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Schedule Pins</h1>

      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">1. Select Board</h2>
          <BoardSelector
            selectedBoard={selectedBoard}
            onBoardSelect={setSelectedBoard}
          />
        </div>

        {selectedBoard && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">2. Upload Pins</h2>
            <PinUploader onPinsLoaded={handlePinsLoaded} />
          </div>
        )}

        {pins.length > 0 && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">3. Schedule Settings</h2>
            <SchedulingControls
              startDate={startDate}
              endDate={endDate}
              randomize={randomize}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onRandomizeChange={setRandomize}
            />
          </div>
        )}

        {pins.length > 0 && (
          <>
            <PinPreview pins={pins} />
            
            <div className="flex flex-col items-end space-y-4">
              {isScheduling && (
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Scheduling pins...</span>
                    <span>{Math.round(schedulingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${schedulingProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button
                onClick={handleSchedule}
                disabled={isScheduling}
                className={`px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isScheduling ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isScheduling ? 'Scheduling...' : `Schedule ${pins.length} Pins`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}