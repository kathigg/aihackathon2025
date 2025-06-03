// pages/feed.tsx
import React from 'react';
import { DomainPost } from '@/types';
import DomainPostCard from '@/components/domains/DomainPost';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ClassificationBanner from '@/components/layout/ClassificationBanner';

const demoFeedPosts: DomainPost[] = [
  {
    id: 'demo-1',
    domain_id: 'air',
    title: 'Drone Signal Interference in Mountainous Terrain',
    body: 'Operators are reporting unreliable GPS and video link. Looking for practical mitigation strategies or proven hardware solutions.',
    author_id: '5',
    author: {
      
      id: '5',
      username: 'recon.tech',
      email: 'recon@army.mil',
      role: 'warfighter',
      verified_dod: true,
      karma_points: 270,
      created_at: '2024-03-01',
      last_active: '2024-06-02'
    },
    upvotes: 12,
    downvotes: 0,
    net_score: 12,
    comment_count: 4,
    is_pinned: false,
    created_at: '2024-06-03T12:00:00Z',
    updated_at: '2024-06-03T12:00:00Z'
  },
  {
    id: 'demo-2',
    domain_id: 'cyber',
    title: 'Bandwidth Optimization for Real-Time Drone Streams',
    body: 'With multiple UAVs streaming back HD video, network congestion is a serious challenge. Anyone implementing codec prioritization or stream shaping at the edge?',
    author_id: '6',
    author: {
      id: '6',
      username: 'codec.captain',
      email: 'codec@navy.mil',
      role: 'technologist',
      verified_dod: false,
      karma_points: 180,
      created_at: '2024-04-15',
      last_active: '2024-06-01'
    },
    upvotes: 8,
    downvotes: 1,
    net_score: 7,
    comment_count: 2,
    is_pinned: false,
    created_at: '2024-06-02T08:30:00Z',
    updated_at: '2024-06-02T08:30:00Z'
  }
];

const FeedPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClassificationBanner level="green" />
      <Header onMenuToggle={() => {}} user={{
        id: '1',
        username: 'tech.innovator',
        email: 'tech@company.com',
        role: 'solution_provider',
        verified_dod: true,
        karma_points: 350,
        created_at: '2024-01-01',
        last_active: '2024-06-02'
      }} />
      <div className="flex">
        <Sidebar
          isOpen={true}
          activeTab="feed"
          onTabChange={() => {}}
          moderationCount={0}
        />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold mb-4">Global Feed</h1>
            {demoFeedPosts.map((post) => (
              <DomainPostCard
                key={post.id}
                post={post}
                onView={(id) => console.log('View post', id)}
                onUpvote={() => {}}
                onDownvote={() => {}}
                onComment={() => {}}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedPage;
