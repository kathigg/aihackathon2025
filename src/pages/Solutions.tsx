import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ClassificationBanner from '@/components/layout/ClassificationBanner';
import SolutionsFeed from '@/components/solutions/SolutionsFeed';
import CreateSolution from '@/components/solutions/CreateSolution';
import SolutionSearch from '@/components/solutions/SolutionSearch';
import SolutionComments from '@/components/solutions/SolutionComments';
import DirectMessagePanel from '@/components/messaging/DirectMessagePanel';
import { Solution, Comment, DirectMessage, MessageThread } from '@/types';

// Mock data for demonstration
const mockUser = {
  id: '1',
  username: 'tech.innovator',
  email: 'tech@company.com',
  role: 'solution_provider' as const,
  verified_dod: true,
  karma_points: 350,
  created_at: '2024-01-01',
  last_active: '2024-06-02'
};

const mockSolutions: Solution[] = [
  {
    id: '1',
    challenge_id: '1',
    title: 'AI-Powered Micro-Drone Swarm for Urban ISR',
    description: 'Autonomous micro-drone swarm system using distributed AI for coordinated reconnaissance in denied urban environments. Features include mesh networking, low acoustic signature, and real-time intelligence fusion.',
    author_id: '2',
    author: {
      id: '2',
      username: 'dronetech_inc',
      email: 'contact@dronetech.com',
      role: 'solution_provider',
      verified_dod: true,
      karma_points: 450,
      created_at: '2024-01-01',
      last_active: '2024-06-02'
    },
    trl_level: 7,
    upvotes: 42,
    downvotes: 3,
    net_score: 39,
    comment_count: 8,
    moderation_status: 'approved',
    video_url: 'https://example.com/demo-video',
    attachments: ['technical_specs.pdf', 'test_results.xlsx'],
    victory_markings: {
      person: 25,
      tank: 8,
      aircraft: 3,
      building: 12
    },
    effectiveness_rating: 9.2,
    deployment_cost: 150000,
    tags: ['swarm', 'ai', 'reconnaissance', 'autonomous'],
    created_at: '2024-05-28T10:00:00Z',
    updated_at: '2024-05-28T10:00:00Z'
  }
  // ... other mock solutions with updated structure
];

const Solutions = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [solutions, setSolutions] = useState<Solution[]>(mockSolutions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [messagePanelOpen, setMessagePanelOpen] = useState(false);
  const [currentThread, setCurrentThread] = useState<{
    id: string;
    otherUser: any;
    challengeTitle: string;
  } | null>(null);
  const [filters, setFilters] = useState({
    trlLevel: '',
    effectivenessRating: '',
    tags: [] as string[]
  });

  const handleUpvote = (solutionId: string) => {
    setSolutions(prev => 
      prev.map(solution => 
        solution.id === solutionId 
          ? { 
              ...solution, 
              upvotes: solution.upvotes + 1,
              net_score: solution.net_score + 1
            }
          : solution
      )
    );
  };

  const handleDownvote = (solutionId: string) => {
    setSolutions(prev => 
      prev.map(solution => 
        solution.id === solutionId 
          ? { 
              ...solution, 
              downvotes: solution.downvotes + 1,
              net_score: solution.net_score - 1
            }
          : solution
      )
    );
  };

  const handleDemo = (solutionId: string) => {
    console.log('Demo solution:', solutionId);
    // Future: Launch simulation environment
  };

  const handleComment = (solutionId: string) => {
    setSelectedSolution(solutionId);
    setActiveTab('comments');
  };

  const handleContact = (authorId: string, solutionId: string) => {
    const solution = solutions.find(s => s.id === solutionId);
    if (solution?.author) {
      setCurrentThread({
        id: `thread-${Date.now()}`,
        otherUser: solution.author,
        challengeTitle: solution.title
      });
      setMessagePanelOpen(true);
    }
  };

  const handleAddComment = (solutionId: string, content: string, parentId?: string) => {
    // Mock comment addition
    console.log('Adding comment:', { solutionId, content, parentId });
    
    // Update comment count
    setSolutions(prev => 
      prev.map(solution => 
        solution.id === solutionId 
          ? { ...solution, comment_count: solution.comment_count + 1 }
          : solution
      )
    );
  };

  const handleSendMessage = (threadId: string, content: string) => {
    console.log('Sending message:', { threadId, content });
    // Future: Send message via real-time channels
  };

  const handleCreateSolution = (newSolution: any) => {
    const solution: Solution = {
      id: Date.now().toString(),
      challenge_id: newSolution.challenge_id || '1',
      title: newSolution.title,
      description: newSolution.description,
      author_id: mockUser.id,
      author: mockUser,
      trl_level: newSolution.trl_level,
      upvotes: 0,
      downvotes: 0,
      net_score: 0,
      comment_count: 0,
      moderation_status: 'pending',
      video_url: newSolution.video_url,
      attachments: newSolution.attachments || [],
      tags: newSolution.tags || [],
      victory_markings: newSolution.victory_markings,
      effectiveness_rating: newSolution.effectiveness_rating,
      deployment_cost: newSolution.deployment_cost,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSolutions(prev => [solution, ...prev]);
    setActiveTab('feed');
  };

  const handleSearch = (query: string, newFilters: any) => {
    setSearchQuery(query);
    setFilters(newFilters);
  };

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = !searchQuery || 
      solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTRL = !filters.trlLevel || solution.trl_level === parseInt(filters.trlLevel);
    
    const matchesRating = !filters.effectivenessRating || 
      solution.effectiveness_rating >= parseFloat(filters.effectivenessRating);

    const matchesTags = filters.tags.length === 0 || 
      filters.tags.some(tag => solution.tags.includes(tag));

    return matchesSearch && matchesTRL && matchesRating && matchesTags;
  });

  const approvedSolutions = filteredSolutions.filter(s => s.moderation_status === 'approved');

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <div className="space-y-6">
            <SolutionSearch onSearch={(query, newFilters) => {
              setSearchQuery(query);
              setFilters(newFilters);
            }} />
            <SolutionsFeed
              solutions={approvedSolutions}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onViewSolution={(id) => console.log('View solution:', id)}
              onDemo={handleDemo}
              onComment={handleComment}
              onContact={handleContact}
              currentUserId={mockUser.id}
              challengeAuthorId="challenge-author-id"
            />
          </div>
        );
      
      case 'comments':
        if (selectedSolution) {
          return (
            <div className="space-y-6">
              <SolutionComments
                solutionId={selectedSolution}
                comments={[]} // Mock empty comments for now
                onAddComment={handleAddComment}
                currentUserId={mockUser.id}
              />
            </div>
          );
        }
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Select a Solution</h2>
            <p className="text-muted-foreground">
              Choose a solution from the feed to view its comments.
            </p>
          </div>
        );
      
      case 'create':
        return (
          <CreateSolution
            onSubmit={(newSolution: any) => {
              const solution: Solution = {
                id: Date.now().toString(),
                challenge_id: newSolution.challenge_id || '1',
                title: newSolution.title,
                description: newSolution.description,
                author_id: mockUser.id,
                author: mockUser,
                trl_level: newSolution.trl_level,
                upvotes: 0,
                downvotes: 0,
                net_score: 0,
                comment_count: 0,
                moderation_status: 'pending',
                video_url: newSolution.video_url,
                attachments: newSolution.attachments || [],
                tags: newSolution.tags || [],
                victory_markings: newSolution.victory_markings,
                effectiveness_rating: newSolution.effectiveness_rating,
                deployment_cost: newSolution.deployment_cost,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              
              setSolutions(prev => [solution, ...prev]);
              setActiveTab('feed');
            }}
            userRole={mockUser.role}
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
      <ClassificationBanner level="green" />
      
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        user={mockUser}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          moderationCount={0}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Solutions Archive</h1>
              <p className="text-muted-foreground">
                Browse proven solutions from defense contractors, startups, and research institutions
              </p>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Direct Message Panel */}
      <DirectMessagePanel
        isOpen={messagePanelOpen}
        onClose={() => setMessagePanelOpen(false)}
        thread={currentThread}
        messages={[]} // Mock empty messages for now
        onSendMessage={handleSendMessage}
        currentUserId={mockUser.id}
      />
    </div>
  );
};

export default Solutions;
