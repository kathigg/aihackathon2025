
export type UserRole = 'warfighter' | 'solution_provider' | 'moderator' | 'admin';

export type ClassificationLevel = 'green' | 'yellow' | 'red';

export type TRLLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'redacted';

export type VoteType = 'up' | 'down';

export type SortOption = 'agency' | 'urgency' | 'trl' | 'newest';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  verified_dod: boolean;
  avatar_url?: string;
  karma_points: number;
  created_at: string;
  last_active: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  author_id: string;
  author?: User;
  classification: ClassificationLevel;
  urgency: UrgencyLevel;
  domain: string;
  tags: string[];
  anonymous: boolean;
  moderation_status: ModerationStatus;
  solution_count: number;
  video_url?: string;
  agency_score?: number;
  created_at: string;
  updated_at: string;
}

export interface VictoryMarkings {
  person?: number;
  tank?: number;
  aircraft?: number;
  building?: number;
  drone?: number;
  vehicle?: number;
  supply_run?: number;
  successful_delivery?: number;
}

export interface Solution {
  id: string;
  challenge_id: string;
  title: string;
  description: string;
  author_id: string;
  author?: User;
  trl_level: TRLLevel;
  upvotes: number;
  downvotes: number;
  net_score: number;
  comment_count: number;
  moderation_status: ModerationStatus;
  video_url?: string;
  attachments: string[];
  tags: string[];
  victory_markings?: VictoryMarkings;
  effectiveness_rating?: number;
  deployment_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  author?: User;
  challenge_id?: string;
  solution_id?: string;
  parent_id?: string;
  upvotes: number;
  created_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  content_type: 'solution' | 'comment' | 'domain_post';
  content_id: string;
  vote_type: VoteType;
  created_at: string;
}

export interface DirectMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  is_read: boolean;
  sender?: User;
}

export interface MessageThread {
  id: string;
  participants: User[];
  last_message?: DirectMessage;
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  slug: string;
  title: string;
  description: string;
  member_count: number;
  challenge_count: number;
  post_count?: number;
  avatar_url?: string;
  isJoined?: boolean;
}

export interface DomainPost {
  id: string;
  domain_id: string;
  domain?: Domain;
  title: string;
  body: string;
  author_id: string;
  author?: User;
  upvotes: number;
  downvotes: number;
  net_score: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModerationAction {
  id: string;
  moderator_id: string;
  content_type: 'challenge' | 'solution' | 'comment' | 'domain_post';
  content_id: string;
  action: 'approve' | 'reject' | 'redact';
  reason?: string;
  created_at: string;
}
