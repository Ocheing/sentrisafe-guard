import { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useSOS } from '@/contexts/SOSContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const PrewrittenMessagesManager = () => {
  const { prewrittenMessages, addPrewrittenMessage, updatePrewrittenMessage, deletePrewrittenMessage, loading } = useSOS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (id: string, message: string) => {
    setEditingId(id);
    setEditMessage(message);
  };

  const saveEdit = async () => {
    if (!editMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setSaving(true);
    await updatePrewrittenMessage(editingId!, editMessage);
    setEditingId(null);
    setSaving(false);
    toast.success('Message updated');
  };

  const handleDelete = async (id: string) => {
    await deletePrewrittenMessage(id);
    toast.success('Message deleted');
  };

  const handleAdd = async () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSaving(true);
    await addPrewrittenMessage(newMessage);
    setNewMessage('');
    setIsAdding(false);
    setSaving(false);
    toast.success('Message added');
  };

  if (loading) {
    return <div className="text-center text-muted-foreground text-sm py-4">Loading messages...</div>;
  }

  return (
    <div className="space-y-3">
      {prewrittenMessages.map((msg) => (
        <Card key={msg.id}>
          <CardContent className="pt-3 pb-3">
            {editingId === msg.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  placeholder="Message"
                  className="text-sm min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} disabled={saving} className="h-7">
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="h-7">
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {msg.is_default && (
                      <Badge variant="secondary" className="text-xs h-5">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{msg.message}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => startEdit(msg.id, msg.message)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    onClick={() => handleDelete(msg.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {isAdding ? (
        <Card>
          <CardContent className="pt-3 pb-3 space-y-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your emergency message..."
              className="text-sm min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={saving} className="h-7">
                <Save className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)} className="h-7">
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-1" />
          Add Message
        </Button>
      )}
    </div>
  );
};

export default PrewrittenMessagesManager;
