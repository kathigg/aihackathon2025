
import React, { useState } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DirectMessage, User } from '@/types';

interface DirectMessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  thread: {
    id: string;
    otherUser: User;
    challengeTitle: string;
  } | null;
  messages: DirectMessage[];
  onSendMessage: (threadId: string, content: string) => void;
  currentUserId: string;
}

const DirectMessagePanel: React.FC<DirectMessagePanelProps> = ({
  isOpen,
  onClose,
  thread,
  messages,
  onSendMessage,
  currentUserId
}) => {
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = () => {
    if (messageContent.trim() && thread) {
      onSendMessage(thread.id, messageContent);
      setMessageContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen || !thread) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l shadow-lg z-50">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <CardTitle className="text-sm">
                  {thread.otherUser.username}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Re: {thread.challengeTitle}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-full">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 ${
                      message.sender_id === currentUserId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.body}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectMessagePanel;
