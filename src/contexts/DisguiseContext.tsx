import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

type DisguiseMode = 'none' | 'weather' | 'notes' | 'period';

interface DisguiseContextType {
  disguiseMode: DisguiseMode;
  setDisguiseMode: (mode: DisguiseMode) => void;
  isDisguised: boolean;
  appName: string;
  appIcon: string;
  loading: boolean;
}

const DisguiseContext = createContext<DisguiseContextType | undefined>(undefined);

const disguiseConfigs = {
  none: { name: 'SentriSafe', icon: 'shield' },
  weather: { name: 'WeatherNow', icon: 'cloud' },
  notes: { name: 'QuickNotes', icon: 'file-text' },
  period: { name: 'CycleTracker', icon: 'heart' },
};

export const DisguiseProvider = ({ children }: { children: ReactNode }) => {
  const [disguiseMode, setDisguiseModeState] = useState<DisguiseMode>('none');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('user_settings')
          .select('disguise_mode')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && disguiseConfigs[data.disguise_mode as DisguiseMode]) {
          setDisguiseModeState(data.disguise_mode as DisguiseMode);
        }
      }
      setLoading(false);
    };

    fetchSettings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
        setDisguiseModeState('none');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setDisguiseMode = async (mode: DisguiseMode) => {
    setDisguiseModeState(mode);
    
    if (userId) {
      const { data: existing } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_settings')
          .update({ disguise_mode: mode })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('user_settings')
          .insert({ user_id: userId, disguise_mode: mode });
      }
    }
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
        loading,
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
