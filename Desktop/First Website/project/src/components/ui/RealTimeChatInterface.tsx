import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RealTimeChatInterfaceProps {
  propertyId: string;
  userId: string;
  otherUserId: string;
  propertyTitle: string;
}

interface Message {
  id: string;
  property_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

export function RealTimeChatInterface({ propertyId, userId, otherUserId, propertyTitle }: RealTimeChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(property_id.eq.${propertyId},sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(property_id.eq.${propertyId},sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();

    const channel = supabase
      .channel(`messages:property_id=eq.${propertyId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new as Message;
        if (
          (msg.sender_id === userId && msg.receiver_id === otherUserId) ||
          (msg.sender_id === otherUserId && msg.receiver_id === userId)
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [propertyId, userId, otherUserId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    setSendError(null);
    if (!newMessage.trim()) return;
    const { error } = await supabase.from('messages').insert({
      property_id: propertyId,
      sender_id: userId,
      receiver_id: otherUserId,
      message: newMessage,
    });
    if (error) {
      setSendError('Failed to send message. Please try again.');
      return;
    }
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-lg w-full mx-auto border rounded-xl shadow-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold text-lg flex items-center gap-2 shadow rounded-t-xl sticky top-0 z-10">
        <span className="truncate">{propertyTitle}</span>
      </div>
      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-2"></span>
            <span className="text-gray-400">Loading messages...</span>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[75%] p-3 rounded-2xl mb-1 shadow text-sm flex flex-col whitespace-pre-line ${
                msg.sender_id === userId
                  ? 'bg-green-500 text-white self-end rounded-br-md'
                  : 'bg-white border self-start rounded-bl-md'
              }`}
            >
              <span>{msg.message}</span>
              <span className="text-[10px] text-right text-gray-300 mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
            <span>No messages yet. Start the conversation!</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <div className="p-3 bg-white flex items-center gap-2 border-t sticky bottom-0 z-10">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border-gray-300 focus:ring-green-500 px-4 py-2 shadow-sm"
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <Button
          onClick={sendMessage}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-5 py-2 shadow-md font-semibold"
          disabled={!newMessage.trim()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </Button>
      </div>
      {sendError && <div className="text-red-500 text-center pb-2">{sendError}</div>}
    </div>
  );
}
