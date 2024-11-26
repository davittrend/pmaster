import React from 'react';
import { useAccountStore } from '../store/account';
import { accountSettingsSchema } from '../types/pinterest';

export function AccountSettings() {
  const { settings, updateSettings } = useAccountStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = e.target.type === 'number' ? Number(value) : value;
    
    try {
      accountSettingsSchema.parse({
        ...settings,
        [name]: newValue,
      });
      updateSettings({ [name]: newValue });
    } catch (error) {
      console.error('Invalid setting value:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="dailyPinLimit" className="block text-sm font-medium text-gray-700">
            Daily Pin Limit
          </label>
          <input
            type="number"
            id="dailyPinLimit"
            name="dailyPinLimit"
            value={settings.dailyPinLimit}
            onChange={handleChange}
            min="1"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferredTimeStart" className="block text-sm font-medium text-gray-700">
              Preferred Start Time
            </label>
            <input
              type="time"
              id="preferredTimeStart"
              name="preferredTimeStart"
              value={settings.preferredTimeStart}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>

          <div>
            <label htmlFor="preferredTimeEnd" className="block text-sm font-medium text-gray-700">
              Preferred End Time
            </label>
            <input
              type="time"
              id="preferredTimeEnd"
              name="preferredTimeEnd"
              value={settings.preferredTimeEnd}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={settings.timezone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          >
            {Intl.supportedValuesOf('timeZone').map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}