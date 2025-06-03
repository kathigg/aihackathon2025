
import React, { useState } from 'react';
import { Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChallengeCard from './ChallengeCard';
import { Challenge, SortOption } from '@/types';

interface ChallengeFeedProps {
  challenges: Challenge[];
  onViewChallenge?: (id: string) => void;
}

const ChallengeFeed: React.FC<ChallengeFeedProps> = ({ 
  challenges, 
  onViewChallenge 
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('agency');
  const [filterBy, setFilterBy] = useState<string>('all');

  const filteredChallenges = challenges.filter(challenge => {
    if (filterBy === 'all') return true;
    if (filterBy === 'urgent') return challenge.urgency === 'critical' || challenge.urgency === 'high';
    if (filterBy === 'video') return challenge.video_url;
    if (filterBy === 'pending') return challenge.moderation_status === 'pending';
    return challenge.domain.toLowerCase().includes(filterBy.toLowerCase());
  });

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case 'agency':
        const aScore = a.agency_score || calculateAgencyScore(a);
        const bScore = b.agency_score || calculateAgencyScore(b);
        return bScore - aScore;
      case 'urgency':
        const urgencyOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const calculateAgencyScore = (challenge: Challenge): number => {
    const urgencyMultiplier = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };
    
    return urgencyMultiplier[challenge.urgency] * 2.5;
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Challenges</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="video">With Video</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="air">Air Domain</SelectItem>
                <SelectItem value="land">Land Domain</SelectItem>
                <SelectItem value="maritime">Maritime</SelectItem>
                <SelectItem value="space">Space</SelectItem>
                <SelectItem value="cyber">Cyber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agency">Agency Score</SelectItem>
                <SelectItem value="urgency">Urgency Level</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {sortedChallenges.length} challenges
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="space-y-4">
        {sortedChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onView={onViewChallenge}
          />
        ))}
      </div>

      {sortedChallenges.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No challenges match your filters.</p>
          <Button variant="outline" className="mt-4" onClick={() => setFilterBy('all')}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChallengeFeed;
