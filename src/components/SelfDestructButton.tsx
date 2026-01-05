import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SelfDestructButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelfDestruct = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Delete all user data from tables
        await Promise.all([
          supabase.from('evidence').delete().eq('user_id', user.id),
          supabase.from('coach_conversations').delete().eq('user_id', user.id),
          supabase.from('safety_alerts').delete().eq('user_id', user.id),
          supabase.from('trusted_contacts').delete().eq('user_id', user.id),
        ]);
      }

      // Clear all local storage
      localStorage.clear();
      sessionStorage.clear();

      // Sign out
      await supabase.auth.signOut();

      toast.success('All data has been wiped');
      navigate('/');
    } catch (error) {
      console.error('Error during self-destruct:', error);
      toast.error('Failed to wipe data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Emergency Data Wipe
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Emergency Data Wipe
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete ALL your data including:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All saved evidence</li>
              <li>Coach conversations</li>
              <li>Trusted contacts</li>
              <li>Safety alerts</li>
              <li>All app settings</li>
            </ul>
            <p className="mt-2 font-semibold">This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSelfDestruct}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? 'Wiping...' : 'Wipe All Data'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SelfDestructButton;
