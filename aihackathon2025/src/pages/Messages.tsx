
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ClassificationBanner from '@/components/layout/ClassificationBanner';
import MessageThreadList from '@/components/messaging/MessageThreadList';
import MessageHistory from '@/components/messaging/MessageHistory';
import MessageProfile from '@/components/messaging/MessageProfile';
import { MessageThread, DirectMessage, User } from '@/types';

// Mock data
const mockUser = {
  id: '1',
  username: 'john.doe',
  email: 'john.doe@mil.gov',
  role: 'warfighter' as const,
  verified_dod: true,
  karma_points: 150,
  created_at: '2024-01-01',
  last_active: '2024-06-02'
};

const mockThreads: MessageThread[] = [
  {
    id: '1',
    participants: [
      mockUser,
      {
        id: '2',
        username: 'tech.solutions',
        email: 'tech@company.com',
        role: 'solution_provider' as const,
        verified_dod: true,
        karma_points: 250,
        created_at: '2024-01-01',
        last_active: '2024-06-02'
      }
    ],
    last_message: {
      id: '1',
      thread_id: '1',
      sender_id: '2',
      body: 'I have a solution for your urban reconnaissance challenge. Would you like to discuss the technical details?',
      created_at: '2024-06-02T10:30:00Z',
      is_read: false
    },
    unread_count: 3,
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-02T10:30:00Z'
  }
];

const Messages = () => {
  const { threadId } = useParams<{ threadId?: string }>();
  const [activeTab, setActiveTab] = useState('messages');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(
    threadId ? mockThreads.find(t => t.id === threadId) || null : null
  );
  const [threads, setThreads] = useState<MessageThread[]>(mockThreads);

  const handleThreadSelect = (thread: MessageThread) => {
    setSelectedThread(thread);
    // Mark messages as read
    setThreads(prev => 
      prev.map(t => 
        t.id === thread.id 
          ? { ...thread, unread_count: 0 }
          : t
      )
    );
  };

  const handleSendMessage = (body: string) => {
    if (!selectedThread) return;

    const newMessage: DirectMessage = {
      id: Date.now().toString(),
      thread_id: selectedThread.id,
      sender_id: mockUser.id,
      body,
      created_at: new Date().toISOString(),
      is_read: true,
      sender: mockUser
    };

    // Update thread with new message
    setThreads(prev => 
      prev.map(t => 
        t.id === selectedThread.id 
          ? { ...t, last_message: newMessage, updated_at: newMessage.created_at }
          : t
      )
    );
  };

  const otherParticipant = selectedThread?.participants.find(p => p.id !== mockUser.id);

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
        
        <main className="flex-1 flex h-[calc(100vh-120px)]">
          {/* Thread List */}
          <div className="w-80 border-r bg-muted/10">
            <div className="p-4 border-b">
              <h1 className="text-xl font-semibold">Messages</h1>
              <p className="text-sm text-muted-foreground">
                {threads.reduce((acc, t) => acc + (t.unread_count || 0), 0)} unread
              </p>
            </div>
            <MessageThreadList
              threads={threads}
              selectedThread={selectedThread}
              onThreadSelect={handleThreadSelect}
              currentUserId={mockUser.id}
            />
          </div>

          {/* Message History */}
          <div className="flex-1 flex flex-col">
            {selectedThread ? (
              <MessageHistory
                thread={selectedThread}
                currentUserId={mockUser.id}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Profile Panel */}
          {selectedThread && otherParticipant && (
            <div className="w-80 border-l bg-muted/10">
              <MessageProfile user={otherParticipant} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;
