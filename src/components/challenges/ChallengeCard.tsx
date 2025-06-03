
import React from 'react';
import { MessageSquare, Calendar, Shield, Flag, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Challenge, ClassificationLevel, UrgencyLevel } from '@/types';
import { cn } from '@/lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  onView?: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onView 
}) => {
  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getClassificationColor = (classification: ClassificationLevel) => {
    switch (classification) {
      case 'red': return 'border-l-red-500';
      case 'yellow': return 'border-l-yellow-500';
      case 'green': return 'border-l-green-500';
    }
  };

  const getAgencyScore = (challenge: Challenge) => {
    if (challenge.agency_score) return challenge.agency_score.toFixed(1);
    
    // Calculate based on urgency and other factors
    const urgencyMultiplier = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };
    
    return (urgencyMultiplier[challenge.urgency] * 2.5).toFixed(1);
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow cursor-pointer border-l-4",
      getClassificationColor(challenge.classification),
      challenge.moderation_status === 'pending' && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getUrgencyColor(challenge.urgency), "text-white")}
              >
                {challenge.urgency.toUpperCase()}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {challenge.domain}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Agency: {getAgencyScore(challenge)}
              </Badge>
              {challenge.video_url && (
                <Badge variant="outline" className="text-xs">
                  <Play className="h-3 w-3 mr-1" />
                  Video
                </Badge>
              )}
            </div>
            
            <h3 
              className="text-lg font-semibold hover:text-blue-600 transition-colors"
              onClick={() => onView?.(challenge.id)}
            >
              {challenge.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {challenge.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{challenge.solution_count} solutions</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(challenge.created_at).toLocaleDateString()}</span>
            </div>

            {challenge.anonymous ? (
              <Badge variant="outline" className="text-xs">
                Anonymous
              </Badge>
            ) : (
              <div className="flex items-center space-x-1">
                <span>by {challenge.author?.username}</span>
                {challenge.author?.verified_dod && (
                  <Shield className="h-3 w-3 text-green-500" />
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {challenge.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {challenge.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{challenge.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {challenge.moderation_status === 'pending' && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center space-x-1 text-yellow-700">
              <Flag className="h-4 w-4" />
              <span className="text-xs font-medium">Pending OPSEC Review</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
