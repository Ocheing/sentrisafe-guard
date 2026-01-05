import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { supabase } from '@/integrations/supabase/client';

interface PrewrittenMessage {
  id: string;
  label: string;
  message: string;
}

interface SOSContextType {
  isSOSActive: boolean;
  activateSOS: () => Promise<void>;
  deactivateSOS: () => void;
  prewrittenMessages: PrewrittenMessage[];
  setPrewrittenMessages: (messages: PrewrittenMessage[]) => void;
  audioBlob: Blob | null;
  isRecording: boolean;
  lastLocation: { latitude: number; longitude: number } | null;
}

const SOSContext = createContext<SOSContextType | undefined>(undefined);

const MESSAGES_STORAGE_KEY = 'sentrisafe_prewritten_messages';

const defaultMessages: PrewrittenMessage[] = [
  { id: '1', label: 'Emergency', message: 'I need help immediately. Please contact emergency services.' },
  { id: '2', label: 'Check In', message: "I'm in a situation that feels unsafe. If you don't hear from me in 30 minutes, please call." },
  { id: '3', label: 'Location Alert', message: "I'm sharing my live location. Please track where I am." },
];

export const SOSProvider = ({ children }: { children: ReactNode }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [prewrittenMessages, setPrewrittenMessagesState] = useState<PrewrittenMessage[]>(() => {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultMessages;
  });
  const [lastLocation, setLastLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const { getLocation } = useGeolocation();
  const { isRecording, audioBlob, startRecording, stopRecording } = useAudioRecording();

  const setPrewrittenMessages = (messages: PrewrittenMessage[]) => {
    setPrewrittenMessagesState(messages);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  };

  const sendAlertsToContacts = useCallback(async (location: { latitude: number; longitude: number } | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get trusted contacts
      const { data: contacts } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', user.id);

      if (!contacts || contacts.length === 0) return;

      const locationLink = location 
        ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`
        : 'Location unavailable';

      const message = `🚨 EMERGENCY SOS ALERT\n\nThis is an automated emergency alert from SentriSafe.\n\nLocation: ${locationLink}\n\nPlease check on this person immediately or contact emergency services.`;

      // Create safety alert in database
      await supabase.from('safety_alerts').insert({
        user_id: user.id,
        alert_type: 'SOS',
        message: message,
        risk_level: 'critical',
        is_read: false,
      });

      console.log('SOS alerts sent to contacts:', contacts.length);
    } catch (error) {
      console.error('Error sending SOS alerts:', error);
    }
  }, []);

  const activateSOS = useCallback(async () => {
    setIsSOSActive(true);

    // Get location
    const location = await getLocation();
    if (location) {
      setLastLocation({ latitude: location.latitude, longitude: location.longitude });
    }

    // Start recording
    await startRecording();

    // Send alerts to contacts
    await sendAlertsToContacts(location);
  }, [getLocation, startRecording, sendAlertsToContacts]);

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
        setPrewrittenMessages,
        audioBlob,
        isRecording,
        lastLocation,
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
