
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Archive, Shield, Settings, Target, MessageSquare, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import DomainTabs from '@/components/domains/DomainTabs';


interface Domain {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  moderationCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  activeTab, 
  onTabChange, 
  moderationCount = 0 
}) => {
  const navigate = useNavigate();
  
  const [joinedDomains, setJoinedDomains] = useState<Domain[]>([
    {
      id: 'air',
      name: 'Air Domain',
      description: 'Aerial warfare and UAV operations',
      memberCount: 1247,
      isJoined: true
    },
    {
      id: 'cyber',
      name: 'Cyber Domain',
      description: 'Cybersecurity and electronic warfare',
      memberCount: 892,
      isJoined: true
    }
  ]);

  const [availableDomains, setAvailableDomains] = useState<Domain[]>([
    {
      id: 'land',
      name: 'Land Domain',
      description: 'Ground operations and robotics',
      memberCount: 1098,
      isJoined: false
    },
    {
      id: 'maritime',
      name: 'Maritime Domain',
      description: 'Naval operations and underwater systems',
      memberCount: 743,
      isJoined: false
    },
    {
      id: 'space',
      name: 'Space Domain',
      description: 'Satellite and space-based systems',
      memberCount: 567,
      isJoined: false
    },
    {
      id: 'intel',
      name: 'Intelligence',
      description: 'ISR and intelligence gathering',
      memberCount: 934,
      isJoined: false
    },
    {
      id: 'logistics',
      name: 'Logistics',
      description: 'Supply chain and support operations',
      memberCount: 612,
      isJoined: false
    },
    {
      id: 'ew',
      name: 'Electronic Warfare',
      description: 'EW systems and countermeasures',
      memberCount: 456,
      isJoined: false
    }
  ]);

  const [selectedDomain, setSelectedDomain] = useState<string | undefined>();
  const [selectedDomainTab, setSelectedDomainTab] = useState<'chat' | 'solutions'>('solutions');

  const navigation = [
    { id: 'feed', name: 'Feed', icon: Home, description: 'Latest challenges' },
    { id: 'create', name: 'New Challenge', icon: Plus, description: 'Submit problem' },
    { id: 'solutions', name: 'Solutions', icon: Target, description: 'Browse solutions' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, description: 'Direct messages', badge: 3 },
    { id: 'marketplace', name: 'Marketplace', icon: ShoppingBag, description: 'View drones' },
    { 
      id: 'moderation', 
      name: 'Moderation', 
      icon: Shield, 
      description: 'OPSEC review',
      badge: moderationCount > 0 ? moderationCount : undefined
    },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'Preferences' },
  ];

  const handleNavigation = (item: any) => {
    if (item.id === 'messages') {
      navigate('/messages');
    } else if (item.id === 'feed') {
      navigate('/feed'); // ✅ Navigates using react-router-dom
    } else if (item.id === 'marketplace') {
        navigate('/marketplace');
      } else if (item.id === 'solutions') {
        navigate('/solutions');
    } else {
      onTabChange(item.id);
    }
  };

  const handleJoinDomain = (domainId: string) => {
    const domain = availableDomains.find(d => d.id === domainId);
    if (domain) {
      setJoinedDomains(prev => [...prev, { ...domain, isJoined: true }]);
      setAvailableDomains(prev => prev.filter(d => d.id !== domainId));
    }
  };

  const handleLeaveDomain = (domainId: string) => {
    const domain = joinedDomains.find(d => d.id === domainId);
    if (domain) {
      setAvailableDomains(prev => [...prev, { ...domain, isJoined: false }]);
      setJoinedDomains(prev => prev.filter(d => d.id !== domainId));
      if (selectedDomain === domainId) {
        setSelectedDomain(undefined);
      }
    }
  };

  const handleDomainSelect = (domainId: string, tab: 'chat' | 'solutions') => {
    setSelectedDomain(domainId);
    setSelectedDomainTab(tab);
    // Navigate to domain-specific content
    onTabChange(`domain-${domainId}-${tab}`);
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      <aside className={cn(
        "bg-slate-900 border-r border-slate-700 transition-all duration-300 overflow-hidden",
        isOpen ? "w-64" : "w-0 lg:w-16"
      )}>
        <div className="p-4 space-y-6">
          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  activeTab === item.id 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800",
                  !isOpen && "lg:justify-center"
                )}
                onClick={() => handleNavigation(item)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {(isOpen || item.badge) && (
                  <span className={cn(
                    "ml-3 truncate",
                    !isOpen && "lg:hidden"
                  )}>
                    {item.name}
                  </span>
                )}
                {item.badge && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          {/* Domain Filters */}
          <DomainTabs
            isOpen={isOpen}
            joinedDomains={joinedDomains}
            availableDomains={availableDomains}
            onJoinDomain={handleJoinDomain}
            onLeaveDomain={handleLeaveDomain}
            onDomainSelect={handleDomainSelect}
            selectedDomain={selectedDomain}
            selectedTab={selectedDomainTab}
          />
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
