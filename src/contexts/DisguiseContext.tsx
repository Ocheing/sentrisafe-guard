import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DisguiseMode = 'none' | 'weather' | 'notes' | 'period';

interface DisguiseContextType {
  disguiseMode: DisguiseMode;
  setDisguiseMode: (mode: DisguiseMode) => void;
  isDisguised: boolean;
  appName: string;
  appIcon: string;
}

const DisguiseContext = createContext<DisguiseContextType | undefined>(undefined);

const DISGUISE_STORAGE_KEY = 'sentrisafe_disguise_mode';

const disguiseConfigs = {
  none: { name: 'SentriSafe', icon: 'shield' },
  weather: { name: 'WeatherNow', icon: 'cloud' },
  notes: { name: 'QuickNotes', icon: 'file-text' },
  period: { name: 'CycleTracker', icon: 'heart' },
};

export const DisguiseProvider = ({ children }: { children: ReactNode }) => {
  const [disguiseMode, setDisguiseModeState] = useState<DisguiseMode>('none');

  useEffect(() => {
    const stored = localStorage.getItem(DISGUISE_STORAGE_KEY) as DisguiseMode;
    if (stored && disguiseConfigs[stored]) {
      setDisguiseModeState(stored);
    }
  }, []);

  const setDisguiseMode = (mode: DisguiseMode) => {
    setDisguiseModeState(mode);
    localStorage.setItem(DISGUISE_STORAGE_KEY, mode);
  };

  const config = disguiseConfigs[disguiseMode];

  return (
    <DisguiseContext.Provider
      value={{
        disguiseMode,
        setDisguiseMode,
        isDisguised: disguiseMode !== 'none',
        appName: config.name,
        appIcon: config.icon,
      }}
    >
      {children}
    </DisguiseContext.Provider>
  );
};

export const useDisguise = () => {
  const context = useContext(DisguiseContext);
  if (!context) {
    throw new Error('useDisguise must be used within a DisguiseProvider');
  }
  return context;
};
