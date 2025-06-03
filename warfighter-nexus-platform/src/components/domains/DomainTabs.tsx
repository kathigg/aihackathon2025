
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, MessageCircle, Target, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Domain {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
}

interface DomainTabsProps {
  isOpen: boolean;
  joinedDomains: Domain[];
  availableDomains: Domain[];
  onJoinDomain: (domainId: string) => void;
  onLeaveDomain: (domainId: string) => void;
  onDomainSelect: (domainId: string, tab: 'chat' | 'solutions') => void;
  selectedDomain?: string;
  selectedTab?: 'chat' | 'solutions';
}

const DomainTabs: React.FC<DomainTabsProps> = ({
  isOpen,
  joinedDomains,
  availableDomains,
  onJoinDomain,
  onLeaveDomain,
  onDomainSelect,
  selectedDomain,
  selectedTab = 'solutions'
}) => {
  const [expandedSection, setExpandedSection] = useState<'joined' | 'available' | null>('joined');
  const navigate = useNavigate();

  const handleDomainClick = (domainId: string) => {
    navigate(`/domain/${domainId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      {/* Joined Domains */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-between text-slate-400 hover:text-white p-2"
          onClick={() => setExpandedSection(expandedSection === 'joined' ? null : 'joined')}
        >
          <span className="text-sm font-semibold uppercase tracking-wider">
            My Domains ({joinedDomains.length})
          </span>
          <Plus className={cn("h-4 w-4 transition-transform", expandedSection === 'joined' && "rotate-45")} />
        </Button>
        
        {expandedSection === 'joined' && (
          <div className="space-y-1 mt-2">
            {joinedDomains.map((domain) => (
              <div key={domain.id} className="space-y-1">
                <div className="flex items-center justify-between p-2 rounded hover:bg-slate-800">
                  <div className="flex-1 cursor-pointer" onClick={() => handleDomainClick(domain.id)}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-300">{domain.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {domain.memberCount}
                      </Badge>
                      <ExternalLink className="h-3 w-3 text-slate-500" />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLeaveDomain(domain.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
                
                {selectedDomain === domain.id && (
                  <Tabs value={selectedTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                      <TabsTrigger 
                        value="solutions"
                        onClick={() => onDomainSelect(domain.id, 'solutions')}
                        className="text-xs data-[state=active]:bg-blue-600"
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Solutions
                      </TabsTrigger>
                      <TabsTrigger 
                        value="chat"
                        onClick={() => onDomainSelect(domain.id, 'chat')}
                        className="text-xs data-[state=active]:bg-blue-600"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Domains */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-between text-slate-400 hover:text-white p-2"
          onClick={() => setExpandedSection(expandedSection === 'available' ? null : 'available')}
        >
          <span className="text-sm font-semibold uppercase tracking-wider">
            Available Domains
          </span>
          <Plus className={cn("h-4 w-4 transition-transform", expandedSection === 'available' && "rotate-45")} />
        </Button>
        
        {expandedSection === 'available' && (
          <div className="space-y-1 mt-2">
            {availableDomains.map((domain) => (
              <div key={domain.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-800">
                <div className="flex-1 cursor-pointer" onClick={() => handleDomainClick(domain.id)}>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-300">{domain.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {domain.memberCount}
                    </Badge>
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{domain.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onJoinDomain(domain.id)}
                  className="text-green-400 hover:text-green-300 p-1"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainTabs;
