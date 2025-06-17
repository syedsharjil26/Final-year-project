import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { RealTimeChatInterface } from '@/components/ui/RealTimeChatInterface';

export default function HomeownerMessages() {
  const { user } = useAuth();
  const userId = user?.id || '';
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<{ propertyId: string; senderId: string; propertyTitle: string } | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('messages')
        .select('property_id, sender_id, message, created_at, users:sender_id(name), property:listings!messages_property_id_fkey(title)')
        .eq('receiver_id', userId);
      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }
      const unique = Array.from(
        new Map(
          (data || []).map((msg) => [msg.property_id + '-' + msg.sender_id, msg])
        ).values()
      );
      setConversations(unique);
    };
    fetchConversations();
  }, [userId]);

  if (!user || user.role !== 'homeowner') return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Message Center</h1>
      <div className="flex gap-8">
        <div className="w-1/3 border-r pr-4">
          <h2 className="font-semibold mb-2">Conversations</h2>
          <ul>
            {conversations.length === 0 && <li className="text-gray-400">No messages yet.</li>}
            {conversations.map((conv) => (
              <li
                key={conv.property_id + '-' + conv.sender_id}
                className={`p-2 rounded cursor-pointer mb-2 ${selected && selected.propertyId === conv.property_id && selected.senderId === conv.sender_id ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                onClick={() => setSelected({ propertyId: conv.property_id, senderId: conv.sender_id, propertyTitle: conv.property?.title || conv.property_id })}
              >
                <div className="font-medium">{conv.users?.name || 'Student'}</div>
                <div className="text-xs text-gray-500">{conv.property?.title || conv.property_id}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          {selected ? (
            <RealTimeChatInterface
              propertyId={selected.propertyId}
              userId={userId}
              otherUserId={selected.senderId}
              propertyTitle={selected.propertyTitle}
            />
          ) : (
            <div className="text-gray-400 text-center mt-16">Select a conversation to view messages.</div>
          )}
        </div>
      </div>
    </div>
  );
}
