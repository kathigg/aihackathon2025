import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

type VoteButtonsProps = {
  postId: string;
  upvotes: number;
  downvotes: number;
  onVote?: (direction: 'up' | 'down' | null) => void; // Optional for parent sync
};

export const VoteButtons = ({ postId, upvotes, downvotes, onVote }: VoteButtonsProps) => {
  const [vote, setVote] = useState<null | 'up' | 'down'>(null);
  const [score, setScore] = useState(upvotes - downvotes);

  const handleVote = (direction: 'up' | 'down') => {
    if (vote === direction) {
      setVote(null);
      setScore(score + (direction === 'up' ? -1 : 1));
      onVote?.(null);
    } else {
      const delta = direction === 'up'
        ? (vote === 'down' ? 2 : 1)
        : (vote === 'up' ? -2 : -1);
      setVote(direction);
      setScore(score + delta);
      onVote?.(direction);
    }

    // Optional: send to backend
    // fetch('/api/vote', {
    //   method: 'POST',
    //   body: JSON.stringify({ postId, vote: direction }),
    // });
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => handleVote('up')}>
        <ThumbsUp className={`w-5 h-5 ${vote === 'up' ? 'text-blue-600' : 'text-gray-400'}`} />
      </button>
      <span className="text-sm font-medium">{score}</span>
      <button onClick={() => handleVote('down')}>
        <ThumbsDown className={`w-5 h-5 ${vote === 'down' ? 'text-red-600' : 'text-gray-400'}`} />
      </button>
    </div>
  );
};
