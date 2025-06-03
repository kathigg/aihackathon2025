import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Users, UserPlus, MessageSquare } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ClassificationBanner from '@/components/layout/ClassificationBanner';
import ChallengeFeed from '@/components/challenges/ChallengeFeed';
import DomainPostCard from '@/components/domains/DomainPost';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Domain as DomainType, DomainPost, Challenge } from '@/types';

// Mock data
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

const mockDomains: Record<string, DomainType> = {
  'air': {
    id: 'air',
    slug: 'air',
    title: 'Air Domain',
    description: 'Aerial warfare, UAVs, and air superiority systems',
    member_count: 1247,
    challenge_count: 89,
    post_count: 156,
    isJoined: true,
  },
  'cyber': {
    id: 'cyber',
    slug: 'cyber',
    title: 'Cyber Domain',
    description: 'Cybersecurity, electronic warfare, and digital operations',
    member_count: 892,
    challenge_count: 156,
    post_count: 234,
    isJoined: true,
  },
  'land': {
    id: 'land',
    slug: 'land',
    title: 'Land Domain',
    description: 'Ground operations, robotics, and terrestrial systems',
    member_count: 1098,
    challenge_count: 203,
    post_count: 178,
    isJoined: false
  }
};

const mockDomainPosts: DomainPost[] = [
  {
    id: '1',
    domain_id: 'air',
    title: 'Welcome to Air Domain - Community Guidelines',
    body: 'Welcome to the Air Domain community! This is a space for discussing aerial warfare, UAV operations, and air superiority systems. Please keep discussions professional and focused on operational challenges.',
    author_id: '1',
    author: {
      id: '1',
      username: 'air.moderator',
      email: 'mod@air.mil',
      role: 'moderator',
      verified_dod: true,
      karma_points: 500,
      created_at: '2024-01-01',
      last_active: '2024-06-02'
    },
    upvotes: 45,
    downvotes: 2,
    net_score: 43,
    comment_count: 12,
    is_pinned: true,
    created_at: '2024-05-01T10:00:00Z',
    updated_at: '2024-05-01T10:00:00Z'
  },
  {
    id: '2',
    domain_id: 'air',
    title: 'New UAV Detection Technologies Discussion',
    body: 'Has anyone had experience with the latest radar-based UAV detection systems? Looking to understand their effectiveness in urban environments.',
    author_id: '2',
    author: mockUser,
    upvotes: 23,
    downvotes: 1,
    net_score: 22,
    comment_count: 8,
    is_pinned: false,
    created_at: '2024-06-01T14:00:00Z',
    updated_at: '2024-06-01T14:00:00Z'
  }
];

const Domain = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('feed');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [domainTab, setDomainTab] = useState<'feed' | 'about' | 'moderators'>('feed');
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [domainPosts, setDomainPosts] = useState<DomainPost[]>(mockDomainPosts);

  const domain = slug ? mockDomains[slug] : null;

  if (!domain) {
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
            <div className="max-w-7xl mx-auto text-center py-12">
              <h1 className="text-3xl font-bold mb-4">Domain Not Found</h1>
              <p className="text-muted-foreground">
                The domain "{slug}" does not exist.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleJoinDomain = () => {
    console.log('Joining domain:', domain.id);
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    const newPost: DomainPost = {
      id: Date.now().toString(),
      domain_id: domain.id,
      title: newPostTitle,
      body: newPostBody,
      author_id: mockUser.id,
      author: mockUser,
      upvotes: 0,
      downvotes: 0,
      net_score: 0,
      comment_count: 0,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setDomainPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostBody('');
    setShowNewPostDialog(false);
  };

  const handlePostVote = (postId: string, voteType: 'up' | 'down') => {
    setDomainPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes,
              downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes,
              net_score: voteType === 'up' ? post.net_score + 1 : post.net_score - 1
            }
          : post
      )
    );
  };

  const renderDomainContent = () => {
    if (domainTab === 'feed') {
      // Filter posts by domain
      const filteredPosts = domainPosts.filter(post => post.domain_id === domain.id);
      const pinnedPosts = filteredPosts.filter(post => post.is_pinned);
      const regularPosts = filteredPosts.filter(post => !post.is_pinned);
    
      return (
        <div className="space-y-6">
          {/* New Post Button */}
          {domain.isJoined && (
            <div className="flex justify-end">
              <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2 mb-4">
                    <Plus className="h-4 w-4" />
                    <span>New Post</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Post in {domain.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Post title"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="What would you like to discuss?"
                      value={newPostBody}
                      onChange={(e) => setNewPostBody(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost}>
                        Create Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
    
          {/* Pinned Posts */}
          {pinnedPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">Pinned Posts</h3>
              {pinnedPosts.map((post) => (
                <DomainPostCard
                  key={post.id}
                  post={post}
                  onUpvote={() => handlePostVote(post.id, 'up')}
                  onDownvote={() => handlePostVote(post.id, 'down')}
                  onComment={(id) => console.log('Comment on post:', id)}
                  onView={(id) => console.log('View post:', id)}
                />
              ))}
            </div>
          )}
    
          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <div className="space-y-4">
              {pinnedPosts.length > 0 && <h3 className="text-lg font-semibold">Recent Posts</h3>}
              {regularPosts.map((post) => (
                <DomainPostCard
                  key={post.id}
                  post={post}
                  onUpvote={() => handlePostVote(post.id, 'up')}
                  onDownvote={() => handlePostVote(post.id, 'down')}
                  onComment={(id) => console.log('Comment on post:', id)}
                  onView={(id) => console.log('View post:', id)}
                />
              ))}
            </div>
          )}
    
          {/* Challenges */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Challenges</h3>
            <ChallengeFeed
              challenges={[]}
              onViewChallenge={(id) => console.log('View challenge:', id)}
            />
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <h4 className="text-md font-medium mb-2">No challenges yet</h4>
              <p className="text-muted-foreground">
                Be the first to post a challenge in this domain.
              </p>
            </div>
          </div>
        </div>
      );
    }
    

    if (domainTab === 'about') {
      return (
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">About {domain.title}</h3>
          <p className="text-muted-foreground mb-6">{domain.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Members</h4>
              <p className="text-2xl font-bold">{domain.member_count.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Challenges</h4>
              <p className="text-2xl font-bold">{domain.challenge_count}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Posts</h4>
              <p className="text-2xl font-bold">{domain.post_count}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Created</h4>
              <p className="text-sm">January 2024</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Moderators</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Avatar>
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">air.moderator</h4>
              <p className="text-sm text-muted-foreground">Domain Administrator</p>
            </div>
          </div>
        </div>
      </div>
    );
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
            {/* Domain Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={domain.avatar_url} />
                    <AvatarFallback className="text-xl">
                      {domain.title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-3xl font-bold mb-2">d/{domain.slug}</h1>
                    <p className="text-muted-foreground mb-3">
                      {domain.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{domain.member_count.toLocaleString()} members</span>
                      </Badge>
                      <Badge variant="outline">
                        {domain.challenge_count} challenges
                      </Badge>
                      <Badge variant="outline">
                        {domain.post_count} posts
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {!domain.isJoined ? (
                  <Button onClick={handleJoinDomain} className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Join Domain</span>
                  </Button>
                ) : (
                  <Button variant="outline" className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Joined</span>
                  </Button>
                )}
              </div>

              {/* Domain Navigation */}
              <Tabs value={domainTab} onValueChange={(value) => setDomainTab(value as 'feed' | 'about' | 'moderators')}>
                <TabsList>
                  <TabsTrigger value="feed">Feed</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="moderators">Moderators</TabsTrigger>
                </TabsList>
                
                <TabsContent value="feed" className="mt-6">
                  {renderDomainContent()}
                </TabsContent>
                
                <TabsContent value="about" className="mt-6">
                  {renderDomainContent()}
                </TabsContent>
                
                <TabsContent value="moderators" className="mt-6">
                  {renderDomainContent()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Domain;
