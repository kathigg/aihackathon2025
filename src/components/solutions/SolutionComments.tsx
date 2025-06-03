
import React, { useState } from 'react';
import { MessageSquare, Reply, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Comment } from '@/types';

interface SolutionCommentsProps {
  solutionId: string;
  comments: Comment[];
  onAddComment: (solutionId: string, content: string, parentId?: string) => void;
  currentUserId?: string;
}

const SolutionComments: React.FC<SolutionCommentsProps> = ({
  solutionId,
  comments,
  onAddComment,
  currentUserId
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(solutionId, newComment);
      setNewComment('');
    }
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(solutionId, replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const topLevelComments = comments.filter(comment => !comment.parent_id);
  const getReplies = (commentId: string) => 
    comments.filter(comment => comment.parent_id === commentId);

  const CommentItem: React.FC<{ comment: Comment; level: number }> = ({ comment, level }) => (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <Card className="mb-3">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{comment.author?.username}</span>
              {comment.author?.verified_dod && (
                <Shield className="h-3 w-3 text-green-500" />
              )}
              <Badge variant="outline" className="text-xs">
                {comment.author?.role}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm mb-2">{comment.content}</p>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
              className="text-xs"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <span className="text-xs text-muted-foreground">
              {comment.upvotes} votes
            </span>
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-3">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-2"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  Reply
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Render replies */}
      {getReplies(comment.id).map(reply => (
        <CommentItem key={reply.id} comment={reply} level={level + 1} />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Add new comment */}
      {currentUserId && (
        <Card>
          <CardContent className="pt-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3"
            />
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Display comments */}
      <div>
        {topLevelComments.map(comment => (
          <CommentItem key={comment.id} comment={comment} level={0} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default SolutionComments;
