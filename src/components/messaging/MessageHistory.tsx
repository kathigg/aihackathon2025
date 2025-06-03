
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MessageThread, DirectMessage } from '@/types';

interface MessageHistoryProps {
  thread: MessageThread;
  currentUserId: string;
  onSendMessage: (body: string) => void;
}

// Mock messages for demo
const mockMessages: DirectMessage[] = [
  {
    id: '1',
    thread_id: '1',
    sender_id: '2',
    body: 'Hi! I saw your urban reconnaissance challenge. I have experience with similar deployments.',
    created_at: '2024-06-01T10:00:00Z',
    is_read: true
  },
  {
    id: '2',
    thread_id: '1',
    sender_id: '1',
    body: 'Great! What kind of solution are you thinking? We need something that can operate in denied environments.',
    created_at: '2024-06-01T10:15:00Z',
    is_read: true
  },
  {
    id: '3',
    thread_id: '1',
    sender_id: '2',
    body: 'I have a solution for your urban reconnaissance challenge. Would you like to discuss the technical details?',
    created_at: '2024-06-02T10:30:00Z',
    is_read: false
  }
];

const MessageHistory: React.FC<MessageHistoryProps> = ({
  thread,
  currentUserId,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<DirectMessage[]>(mockMessages);

  const otherParticipant = thread.participants.find(p => p.id !== currentUserId);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: DirectMessage = {
      id: Date.now().toString(),
      thread_id: thread.id,
      sender_id: currentUserId,
      body: newMessage,
      created_at: new Date().toISOString(),
      is_read: true
    };

    setMessages(prev => [...prev, message]);
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-muted/10">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={otherParticipant?.avatar_url} />
            <AvatarFallback>
              {otherParticipant?.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{otherParticipant?.username}</h3>
            <p className="text-xs text-muted-foreground">
              {otherParticipant?.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === currentUserId;
          const sender = isOwn 
            ? thread.participants.find(p => p.id === currentUserId)
            : otherParticipant;

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3",
                isOwn && "flex-row-reverse space-x-reverse"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={sender?.avatar_url} />
                <AvatarFallback>
                  {sender?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                isOwn 
                  ? "bg-blue-600 text-white" 
                  : "bg-muted"
              )}>
                <p className="text-sm">{message.body}</p>
                <p className={cn(
                  "text-xs mt-1",
                  isOwn ? "text-blue-100" : "text-muted-foreground"
                )}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-muted/10">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[80px] resize-none"
          />
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageHistory;
