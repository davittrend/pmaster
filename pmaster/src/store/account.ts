import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AccountSettings {
  dailyPinLimit: number;
  preferredTimeStart: string;
  preferredTimeEnd: string;
  timezone: string;
}

interface AccountState {
  settings: AccountSettings;
  updateSettings: (settings: Partial<AccountSettings>) => void;
}

const DEFAULT_SETTINGS: AccountSettings = {
  dailyPinLimit: 25,
  preferredTimeStart: '09:00',
  preferredTimeEnd: '21:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'pin-master-account',
    }
  )
);