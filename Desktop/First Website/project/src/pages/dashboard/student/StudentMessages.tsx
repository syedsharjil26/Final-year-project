import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { ChatInterface } from '@/components/ui/ChatInterface';

interface Conversation {
	id: string;
	with: {
		id: string;
		name: string;
		avatar: string;
		role: string;
	};
	property: {
		id: string;
		title: string;
	};
	lastMessage: string;
	lastMessageTime: string;
	unread: boolean;
}

export default function StudentMessages() {
	const { user } = useAuth();
	const [conversations, setConversations] = useState<Conversation[]>([]);

	// Fetch conversations from the database
	useEffect(() => {
		const fetchConversations = async () => {
			if (!user) return;

			const { data, error } = await supabase
				.from('messages')
				.select('id, sender_id, receiver_id, property_id, content, created_at')
				.eq('receiver_id', user.id)
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching conversations:', error);
			} else {
				// Group messages by conversation logic here
				const groupedConversations = data.reduce((acc: any, message: any) => {
					const conversationId = message.property_id;
					if (!acc[conversationId]) {
						acc[conversationId] = {
							id: conversationId,
							with: {
								id: message.sender_id,
								name: 'Unknown', // Fetch sender details separately
								avatar: '',
								role: 'homeowner',
							},
							property: {
								id: message.property_id,
								title: 'Property Title', // Fetch property details separately
							},
							lastMessage: message.content,
							lastMessageTime: message.created_at,
							unread: true,
						};
					}
					return acc;
				}, {});

				setConversations(Object.values(groupedConversations));
			}
		};

		fetchConversations();
	}, [user]);

	const formatDate = (timestamp: string) => {
		const date = new Date(timestamp);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		} else {
			return date.toLocaleDateString();
		}
	};

	// Get messages for the active conversation
	const conversationMessages = conversations;

	// Group messages by date
	const groupedMessages: { [key: string]: any[] } = {};
	conversationMessages.forEach((message) => {
		const date = formatDate(message.lastMessageTime);
		if (!groupedMessages[date]) {
			groupedMessages[date] = [];
		}
		groupedMessages[date].push(message);
	});

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Message Center</h1>

			{conversations.length > 0 ? (
				<div className="space-y-4">
					{conversations.map((conversation) => (
						<div key={conversation.id} className="p-4 border rounded">
							<h2 className="text-lg font-bold">{conversation.property.title}</h2>
							<ChatInterface
								conversationId={conversation.id}
								userId={user?.id || ''}
								participantName={conversation.with.name}
							/>
						</div>
					))}
				</div>
			) : (
				<p>No conversations found.</p>
			)}
		</div>
	);
}