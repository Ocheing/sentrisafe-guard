import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { supabase } from '@/integrations/supabase/client';

interface PrewrittenMessage {
  id: string;
  message: string;
  is_default: boolean;
}

interface SOSContextType {
  isSOSActive: boolean;
  activateSOS: (triggerType?: string) => Promise<void>;
  deactivateSOS: () => void;
  prewrittenMessages: PrewrittenMessage[];
  addPrewrittenMessage: (message: string, isDefault?: boolean) => Promise<void>;
  updatePrewrittenMessage: (id: string, message: string) => Promise<void>;
  deletePrewrittenMessage: (id: string) => Promise<void>;
  audioBlob: Blob | null;
  isRecording: boolean;
  lastLocation: { latitude: number; longitude: number } | null;
  loading: boolean;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

interface UserSettings {
  shake_sos_enabled: boolean;
  keyboard_sos_enabled: boolean;
  auto_location_enabled: boolean;
  auto_recording_enabled: boolean;
}

const defaultSettings: UserSettings = {
  shake_sos_enabled: true,
  keyboard_sos_enabled: true,
  auto_location_enabled: true,
  auto_recording_enabled: true,
};

const SOSContext = createContext<SOSContextType | undefined>(undefined);

const defaultMessages = [
  { message: 'I need help immediately. Please contact emergency services.', is_default: true },
  { message: "I'm in a situation that feels unsafe. If you don't hear from me in 30 minutes, please call.", is_default: false },
  { message: "I'm sharing my live location. Please track where I am.", is_default: false },
];

export const SOSProvider = ({ children }: { children: ReactNode }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [prewrittenMessages, setPrewrittenMessages] = useState<PrewrittenMessage[]>([]);
  const [lastLocation, setLastLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const { getLocation } = useGeolocation();
  const { isRecording, audioBlob, startRecording, stopRecording } = useAudioRecording();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        await Promise.all([
          fetchMessages(user.id),
          fetchSettings(user.id),
        ]);
      }
      setLoading(false);
    };

    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchMessages(session.user.id);
        fetchSettings(session.user.id);
      } else {
        setUserId(null);
        setPrewrittenMessages([]);
        setSettings(defaultSettings);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMessages = async (uid: string) => {
    const { data } = await supabase
      .from('prewritten_messages')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setPrewrittenMessages(data);
    } else {
      // Initialize with default messages
      for (const msg of defaultMessages) {
        await supabase.from('prewritten_messages').insert({
          user_id: uid,
          message: msg.message,
          is_default: msg.is_default,
        });
      }
      const { data: newData } = await supabase
        .from('prewritten_messages')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: true });
      if (newData) setPrewrittenMessages(newData);
    }
  };

  const fetchSettings = async (uid: string) => {
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();

    if (data) {
      setSettings({
        shake_sos_enabled: data.shake_sos_enabled,
        keyboard_sos_enabled: data.keyboard_sos_enabled,
        auto_location_enabled: data.auto_location_enabled,
        auto_recording_enabled: data.auto_recording_enabled,
      });
    } else {
      // Create default settings
      await supabase.from('user_settings').insert({
        user_id: uid,
        ...defaultSettings,
      });
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    if (userId) {
      await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', userId);
    }
  };

  const addPrewrittenMessage = async (message: string, isDefault = false) => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('prewritten_messages')
      .insert({ user_id: userId, message, is_default: isDefault })
      .select()
      .single();

    if (data && !error) {
      setPrewrittenMessages([...prewrittenMessages, data]);
    }
  };

  const updatePrewrittenMessage = async (id: string, message: string) => {
    await supabase
      .from('prewritten_messages')
      .update({ message })
      .eq('id', id);

    setPrewrittenMessages(prewrittenMessages.map(m => 
      m.id === id ? { ...m, message } : m
    ));
  };

  const deletePrewrittenMessage = async (id: string) => {
    await supabase
      .from('prewritten_messages')
      .delete()
      .eq('id', id);

    setPrewrittenMessages(prewrittenMessages.filter(m => m.id !== id));
  };

  const sendAlertsToContacts = useCallback(async (
    location: { latitude: number; longitude: number } | null,
    triggerType: string
  ) => {
    try {
      if (!userId) return;

      // Get trusted contacts
      const { data: contacts } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', userId);

      const locationLink = location 
        ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`
        : 'Location unavailable';

      // Get default message
      const defaultMsg = prewrittenMessages.find(m => m.is_default);
      const messageText = defaultMsg?.message || 'Emergency SOS activated!';

      const fullMessage = `🚨 EMERGENCY SOS ALERT\n\n${messageText}\n\nLocation: ${locationLink}\n\nPlease check on this person immediately or contact emergency services.`;

      // Create safety alert in database
      await supabase.from('safety_alerts').insert({
        user_id: userId,
        alert_type: 'SOS',
        message: fullMessage,
        risk_level: 'critical',
        is_read: false,
      });

      // Log SOS event
      await supabase.from('sos_events').insert({
        user_id: userId,
        trigger_type: triggerType,
        latitude: location?.latitude,
        longitude: location?.longitude,
        message_sent: fullMessage,
        contacts_notified: contacts?.map(c => c.contact_name) || [],
      });

      console.log('SOS alerts sent to contacts:', contacts?.length || 0);
    } catch (error) {
      console.error('Error sending SOS alerts:', error);
    }
  }, [userId, prewrittenMessages]);

  const activateSOS = useCallback(async (triggerType = 'manual') => {
    setIsSOSActive(true);

    let location = null;
    
    // Get location if enabled
    if (settings.auto_location_enabled) {
      location = await getLocation();
      if (location) {
        setLastLocation({ latitude: location.latitude, longitude: location.longitude });
      }
    }

    // Start recording if enabled
    if (settings.auto_recording_enabled) {
      await startRecording();
    }

    // Send alerts to contacts
    await sendAlertsToContacts(location, triggerType);
  }, [getLocation, startRecording, sendAlertsToContacts, settings]);

  const deactivateSOS = useCallback(() => {
    setIsSOSActive(false);
    stopRecording();
  }, [stopRecording]);

  return (
    <SOSContext.Provider
      value={{
        isSOSActive,
        activateSOS,
        deactivateSOS,
        prewrittenMessages,
        addPrewrittenMessage,
        updatePrewrittenMessage,
        deletePrewrittenMessage,
        audioBlob,
        isRecording,
        lastLocation,
        loading,
        settings,
        updateSettings,
      }}
    >
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error('useSOS must be used within a SOSProvider');
  }
  return context;
};
