
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SolutionCard from './SolutionCard';
import { Solution } from '@/types';

interface SolutionsFeedProps {
  solutions: Solution[];
  onUpvote?: (id: string) => void;
  onDownvote?: (id: string) => void;
  onViewSolution?: (id: string) => void;
  onDemo?: (id: string) => void;
  onComment?: (id: string) => void;
  onContact?: (authorId: string, solutionId: string) => void;
  currentUserId?: string;
  challengeAuthorId?: string;
}

const SolutionsFeed: React.FC<SolutionsFeedProps> = ({ 
  solutions, 
  onUpvote,
  onDownvote,
  onViewSolution,
  onDemo,
  onComment,
  onContact,
  currentUserId,
  challengeAuthorId
}) => {
  const navigate = useNavigate();

  const handleMessage = (authorId: string) => {
    // Navigate to messages and create/open thread with author
    navigate('/messages');
  };

  if (solutions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No solutions found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or check back later for new solutions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {solutions.map((solution) => (
        <SolutionCard
          key={solution.id}
          solution={solution}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          onView={onViewSolution}
          onDemo={onDemo}
          onComment={onComment}
          onContact={onContact}
          onMessage={handleMessage}
          currentUserId={currentUserId}
          challengeAuthorId={challengeAuthorId}
        />
      ))}
    </div>
  );
};

export default SolutionsFeed;
