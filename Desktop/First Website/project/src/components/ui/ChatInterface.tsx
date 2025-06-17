import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInterfaceProps {
  conversationId: string;
  userId: string;
  participantName: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export function ChatInterface({ conversationId, userId, participantName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('property_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: userId,
      receiver_id: '', // Replace with actual receiver ID
      property_id: conversationId,
      content: newMessage,
      status: 'sent',
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender_id: userId,
          receiver_id: '',
          content: newMessage,
          created_at: new Date().toISOString(),
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full border rounded shadow-md">
      {/* Header */}
      <div className="p-4 bg-blue-500 text-white font-bold rounded-t">
        Chat with {participantName}
      </div>

      {/* Message List */}
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded mb-2 ${
              message.sender_id === userId ? 'bg-blue-500 text-white self-end' : 'bg-gray-200'
            }`}
          >
            <p>{message.content}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 bg-gray-100 flex items-center gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={sendMessage} className="bg-blue-500 text-white">
          Send
        </Button>
      </div>
    </div>
  );
}
