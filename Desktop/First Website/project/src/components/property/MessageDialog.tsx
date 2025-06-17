import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

interface MessageDialogProps {
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  ownerName: string;
}

export function MessageDialog({ propertyId, propertyTitle, ownerId, ownerName }: MessageDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to send messages');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsLoading(true);

    try {
      // Create a new message in the messages table
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: ownerId,
        property_id: propertyId,
        content: message,
        status: 'unread'
      });

      if (error) throw error;

      toast.success('Message sent successfully!');
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Button className="w-full" onClick={() => toast.error('Please log in to send messages')}>
        Message Landlord
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Message Landlord</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Message to {ownerName}</DialogTitle>
          <DialogDescription>
            Regarding: {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
