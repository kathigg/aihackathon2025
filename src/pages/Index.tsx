
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ClassificationBanner from '@/components/layout/ClassificationBanner';
import ChallengeFeed from '@/components/challenges/ChallengeFeed';
import CreateChallenge from '@/components/challenges/CreateChallenge';
import ModerationQueue from '@/components/moderation/ModerationQueue';
import { Challenge, Solution } from '@/types';

const storedUser = localStorage.getItem("user");
const mockUser = storedUser ? JSON.parse(storedUser) : null;

const user = JSON.parse(localStorage.getItem("user") || "{}");
user.karma_points = 50;
localStorage.setItem("user", JSON.stringify(user));

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Urban Reconnaissance in Denied Environment',
    description: 'Need innovative solutions for conducting reconnaissance in urban environments where traditional ISR assets are compromised or unavailable. Looking for low-signature, deployable systems that can provide real-time intelligence.',
    author_id: '1',
    author: mockUser,
    classification: 'yellow',
    urgency: 'high',
    domain: 'Intelligence',
    tags: ['reconnaissance', 'urban', 'isr', 'stealth'],
    anonymous: false,
    moderation_status: 'approved',
    solution_count: 8,
    agency_score: 85,
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Counter-UAS Swarm Defense',
    description: 'Seeking cost-effective solutions to detect and neutralize coordinated drone swarms targeting forward operating bases. Current systems are overwhelmed by simultaneous multiple targets.',
    author_id: '2',
    classification: 'green',
    urgency: 'critical',
    domain: 'Air Domain',
    tags: ['counter-uas', 'swarm', 'defense', 'detection'],
    anonymous: true,
    moderation_status: 'approved',
    solution_count: 12,
    agency_score: 95,
    video_url: 'https://example.com/video',
    created_at: '2024-05-30T14:30:00Z',
    updated_at: '2024-05-30T14:30:00Z'
  },
  {
    id: '3',
    title: 'Logistics Resupply in Contested Areas',
    description: 'Challenge: Automated resupply methods for units operating in areas with high threat of interdiction. Traditional convoy operations too risky.',
    author_id: '3',
    classification: 'yellow',
    urgency: 'medium',
    domain: 'Logistics',
    tags: ['logistics', 'resupply', 'automation', 'contested'],
    anonymous: false,
    moderation_status: 'pending',
    solution_count: 3,
    agency_score: 70,
    created_at: '2024-06-02T08:15:00Z',
    updated_at: '2024-06-02T08:15:00Z'
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);

  const handleCreateChallenge = (newChallenge: any) => {
    const challenge: Challenge = {
      id: Date.now().toString(),
      ...newChallenge,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setChallenges(prev => [challenge, ...prev]);
    setActiveTab('feed');
  };

  const handleModeration = (contentId: string, action: 'approve' | 'reject' | 'redact', reason?: string) => {
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === contentId
          ? { ...challenge, moderation_status: action === 'approve' ? 'approved' : action as any }
          : challenge
      )
    );
  };

  const pendingChallenges = challenges.filter(c => c.moderation_status === 'pending');
  const approvedChallenges = challenges.filter(c => c.moderation_status === 'approved');

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <ChallengeFeed
            challenges={approvedChallenges}
            onViewChallenge={(id) => console.log('View challenge:', id)}
          />
        );
      
      case 'create':
        return (
          <CreateChallenge
            onSubmit={handleCreateChallenge}
            userRole={mockUser.role}
          />
        );
      
      case 'moderation':
        return (
          <ModerationQueue
            pendingChallenges={pendingChallenges}
            pendingSolutions={[]}
            onModerate={handleModeration}
          />
        );
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Feature Coming Soon</h2>
            <p className="text-muted-foreground">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} functionality will be available in the next update.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Classification Banner */}
      <ClassificationBanner level="green" />
      
      {/* Header */}
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        user={mockUser}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          moderationCount={pendingChallenges.length}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
