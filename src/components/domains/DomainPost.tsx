
import React from 'react';
import { ArrowUp, ArrowDown, Calendar, MessageSquare, Pin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DomainPost } from '@/types';

interface DomainPostProps {
  post: DomainPost;
  onUpvote?: (id: string) => void;
  onDownvote?: (id: string) => void;
  onComment?: (id: string) => void;
  onView?: (id: string) => void;
}

const DomainPostCard: React.FC<DomainPostProps> = ({
  post,
  onUpvote,
  onDownvote,
  onComment,
  onView
}) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${post.is_pinned ? 'border-green-200 bg-green-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {post.is_pinned && (
              <Pin className="h-4 w-4 text-green-600 mt-1" />
            )}
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author?.avatar_url} />
              <AvatarFallback>
                {post.author?.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium">{post.author?.username}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                {post.is_pinned && (
                  <Badge variant="outline" className="text-xs">
                    Pinned
                  </Badge>
                )}
              </div>
              
              <h3 
                className="text-lg font-semibold hover:text-blue-600 transition-colors cursor-pointer mb-2"
                onClick={() => onView?.(post.id)}
              >
                {post.title}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.body}
              </p>
            </div>
          </div>

          {/* Voting Controls */}
          <div className="flex flex-col items-center space-y-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpvote?.(post.id)}
              className="flex flex-col h-auto py-1 hover:bg-green-50"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {post.net_score}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownvote?.(post.id)}
              className="flex flex-col h-auto py-1 hover:bg-red-50"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comment_count} comments</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onComment?.(post.id)}
              className="flex items-center space-x-1"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Comment</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => onView?.(post.id)}>
              View Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainPostCard;
