import { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useSOS } from '@/contexts/SOSContext';
import { toast } from 'sonner';

const PrewrittenMessagesManager = () => {
  const { prewrittenMessages, setPrewrittenMessages } = useSOS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const startEdit = (id: string, label: string, message: string) => {
    setEditingId(id);
    setEditLabel(label);
    setEditMessage(message);
  };

  const saveEdit = () => {
    if (!editLabel.trim() || !editMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const updated = prewrittenMessages.map(m =>
      m.id === editingId ? { ...m, label: editLabel, message: editMessage } : m
    );
    setPrewrittenMessages(updated);
    setEditingId(null);
    toast.success('Message updated');
  };

  const deleteMessage = (id: string) => {
    const updated = prewrittenMessages.filter(m => m.id !== id);
    setPrewrittenMessages(updated);
    toast.success('Message deleted');
  };

  const addMessage = () => {
    if (!newLabel.trim() || !newMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newMsg = {
      id: Date.now().toString(),
      label: newLabel,
      message: newMessage,
    };
    setPrewrittenMessages([...prewrittenMessages, newMsg]);
    setNewLabel('');
    setNewMessage('');
    setIsAdding(false);
    toast.success('Message added');
  };

  return (
    <div className="space-y-3">
      {prewrittenMessages.map((msg) => (
        <Card key={msg.id}>
          <CardContent className="pt-3 pb-3">
            {editingId === msg.id ? (
              <div className="space-y-2">
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Label"
                  className="h-8 text-sm"
                />
                <Textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  placeholder="Message"
                  className="text-sm min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="h-7">
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
                  <p className="font-medium text-sm">{msg.label}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{msg.message}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => startEdit(msg.id, msg.label, msg.message)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    onClick={() => deleteMessage(msg.id)}
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
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (e.g., 'Emergency')"
              className="h-8 text-sm"
            />
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message text..."
              className="text-sm min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addMessage} className="h-7">
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
