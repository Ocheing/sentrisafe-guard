
-- Create table for user settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  disguise_mode TEXT NOT NULL DEFAULT 'none',
  shake_sos_enabled BOOLEAN NOT NULL DEFAULT true,
  keyboard_sos_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_location_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_recording_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create table for pre-written messages
CREATE TABLE public.prewritten_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prewritten_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own messages" 
ON public.prewritten_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own messages" 
ON public.prewritten_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" 
ON public.prewritten_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" 
ON public.prewritten_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create table for SOS events log
CREATE TABLE public.sos_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trigger_type TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  recording_url TEXT,
  message_sent TEXT,
  contacts_notified TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sos_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own events" 
ON public.sos_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own events" 
ON public.sos_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for settings updated_at
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
