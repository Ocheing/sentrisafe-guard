import { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSOS } from '@/contexts/SOSContext';
import { toast } from 'sonner';

const SOSButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { isSOSActive, activateSOS, deactivateSOS, isRecording, lastLocation } = useSOS();

  const handleSOSClick = () => {
    if (isSOSActive) {
      deactivateSOS();
      toast.success('SOS deactivated');
    } else {
      setShowConfirm(true);
    }
  };

  const confirmSOS = async () => {
    setShowConfirm(false);
    await activateSOS();
    toast.success('SOS activated - Alerts sent to trusted contacts');
  };

  if (isSOSActive) {
    return (
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
        <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-xs flex items-center gap-2 animate-pulse">
          {isRecording && <Mic className="w-3 h-3" />}
          {lastLocation && <MapPin className="w-3 h-3" />}
          <span>SOS Active</span>
        </div>
        <Button
          onClick={handleSOSClick}
          variant="outline"
          size="sm"
          className="border-destructive text-destructive"
        >
          <X className="w-4 h-4 mr-1" />
          Stop SOS
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={handleSOSClick}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-destructive hover:bg-destructive/90 shadow-lg"
        size="icon"
      >
        <AlertTriangle className="w-6 h-6" />
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Activate SOS?
            </DialogTitle>
            <DialogDescription className="text-sm">
              This will:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Share your location with trusted contacts</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Mic className="w-4 h-4 text-primary" />
              <span>Start audio recording</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Phone className="w-4 h-4 text-primary" />
              <span>Send emergency alerts</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={confirmSOS} className="flex-1 bg-destructive hover:bg-destructive/90">
              Activate SOS
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
