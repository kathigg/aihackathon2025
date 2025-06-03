
import React from 'react';
import { ArrowUp, ArrowDown, Calendar, Star, Play, Paperclip, DollarSign, TrendingUp, MonitorPlay, MessageSquare, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Solution, TRLLevel } from '@/types';
import VictoryMarkings from './VictoryMarkings';

interface SolutionCardProps {
  solution: Solution;
  onUpvote?: (id: string) => void;
  onDownvote?: (id: string) => void;
  onView?: (id: string) => void;
  onDemo?: (id: string) => void;
  onComment?: (id: string) => void;
  onContact?: (authorId: string, solutionId: string) => void;
  onMessage?: (authorId: string) => void;
  currentUserId?: string;
  challengeAuthorId?: string;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ 
  solution, 
  onUpvote, 
  onDownvote,
  onView,
  onDemo,
  onComment,
  onContact,
  onMessage,
  currentUserId,
  challengeAuthorId
}) => {
  const getTRLColor = (trl: TRLLevel) => {
    if (trl <= 3) return 'bg-red-500';
    if (trl <= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTRLLabel = (trl: TRLLevel) => {
    const labels = {
      1: 'Basic Research',
      2: 'Concept Formation',
      3: 'Proof of Concept',
      4: 'Laboratory Validation',
      5: 'Component Validation',
      6: 'System Demonstration',
      7: 'System Prototype',
      8: 'System Complete',
      9: 'Operational Proven'
    };
    return labels[trl];
  };

  const formatCost = (cost: number) => {
    if (cost >= 1000000) {
      return `$${(cost / 1000000).toFixed(1)}M`;
    } else if (cost >= 1000) {
      return `$${(cost / 1000).toFixed(0)}K`;
    }
    return `$${cost}`;
  };

  const canContact = currentUserId === challengeAuthorId && currentUserId !== solution.author_id;
  const canMessage = currentUserId && currentUserId !== solution.author_id;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge 
                variant="outline" 
                className={`text-xs text-white ${getTRLColor(solution.trl_level)}`}
              >
                TRL {solution.trl_level}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {getTRLLabel(solution.trl_level)}
              </Badge>
              {solution.video_url && (
                <Badge variant="outline" className="text-xs">
                  <Play className="h-3 w-3 mr-1" />
                  Demo
                </Badge>
              )}
              {solution.attachments.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {solution.attachments.length} files
                </Badge>
              )}
              {solution.effectiveness_rating && (
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {solution.effectiveness_rating}/10
                </Badge>
              )}
            </div>
            
            <h3 
              className="text-lg font-semibold hover:text-blue-600 transition-colors cursor-pointer mb-2"
              onClick={() => onView?.(solution.id)}
            >
              {solution.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {solution.description}
            </p>

            {/* Victory Markings */}
            {solution.victory_markings && (
              <div className="mb-3">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Proven Effectiveness
                </div>
                <VictoryMarkings markings={solution.victory_markings} />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {solution.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Voting Controls */}
          <div className="flex flex-col items-center space-y-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpvote?.(solution.id)}
              className="flex flex-col h-auto py-1 hover:bg-green-50"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {solution.net_score}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownvote?.(solution.id)}
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
              <Calendar className="h-4 w-4" />
              <span>{new Date(solution.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center space-x-1">
              <span>by {solution.author?.username}</span>
              {solution.author?.role === 'solution_provider' && (
                <Star className="h-3 w-3 text-blue-500" />
              )}
            </div>

            {solution.deployment_cost && (
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>{formatCost(solution.deployment_cost)}</span>
              </div>
            )}

            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{solution.comment_count} comments</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {solution.moderation_status === 'pending' && (
              <Badge variant="outline" className="text-xs">
                Pending Review
              </Badge>
            )}
            
            {canMessage && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onMessage?.(solution.author_id)}
                className="flex items-center space-x-1"
              >
                <Mail className="h-4 w-4" />
                <span>Message</span>
              </Button>
            )}
            
            {canContact && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onContact?.(solution.author_id, solution.id)}
                className="flex items-center space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Contact</span>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onComment?.(solution.id)}
              className="flex items-center space-x-1"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Comment</span>
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => onDemo?.(solution.id)}
              className="flex items-center space-x-1"
            >
              <MonitorPlay className="h-4 w-4" />
              <span>Demo</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => onView?.(solution.id)}>
              View Solution
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolutionCard;
