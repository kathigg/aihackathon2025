
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageThread } from '@/types';

interface MessageThreadListProps {
  threads: MessageThread[];
  selectedThread: MessageThread | null;
  onThreadSelect: (thread: MessageThread) => void;
  currentUserId: string;
}

const MessageThreadList: React.FC<MessageThreadListProps> = ({
  threads,
  selectedThread,
  onThreadSelect,
  currentUserId
}) => {
  return (
    <div className="space-y-1 p-2">
      {threads.map((thread) => {
        const otherParticipant = thread.participants.find(p => p.id !== currentUserId);
        const isSelected = selectedThread?.id === thread.id;
        const hasUnread = (thread.unread_count || 0) > 0;

        return (
          <div
            key={thread.id}
            className={cn(
              "p-3 rounded-lg cursor-pointer transition-colors",
              isSelected 
                ? "bg-blue-100 border border-blue-200" 
                : "hover:bg-muted/50",
              hasUnread && "bg-blue-50"
            )}
            onClick={() => onThreadSelect(thread)}
          >
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherParticipant?.avatar_url} />
                <AvatarFallback>
                  {otherParticipant?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn(
                    "text-sm truncate",
                    hasUnread ? "font-semibold" : "font-medium"
                  )}>
                    {otherParticipant?.username}
                  </h4>
                  {hasUnread && (
                    <Badge variant="default" className="ml-2">
                      {thread.unread_count}
                    </Badge>
                  )}
                </div>
                
                {thread.last_message && (
                  <p className={cn(
                    "text-xs text-muted-foreground line-clamp-2",
                    hasUnread && "font-medium text-foreground"
                  )}>
                    {thread.last_message.body}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(thread.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      
      {threads.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No conversations yet</p>
        </div>
      )}
    </div>
  );
};

export default MessageThreadList;
