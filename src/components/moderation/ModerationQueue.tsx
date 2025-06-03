
import React, { useState } from 'react';
import { Check, X, Edit, Eye, Flag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Challenge, Solution, ModerationAction } from '@/types';

interface ModerationQueueProps {
  pendingChallenges: Challenge[];
  pendingSolutions: Solution[];
  onModerate: (contentId: string, action: 'approve' | 'reject' | 'redact', reason?: string) => void;
}

const ModerationQueue: React.FC<ModerationQueueProps> = ({ 
  pendingChallenges, 
  pendingSolutions, 
  onModerate 
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState('');

  const handleModeration = (contentId: string, action: 'approve' | 'reject' | 'redact') => {
    onModerate(contentId, action, moderationReason);
    setSelectedItem(null);
    setModerationReason('');
  };

  const ChallengeItem = ({ challenge }: { challenge: Challenge }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{challenge.title}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline">{challenge.domain}</Badge>
              <Badge variant={challenge.urgency === 'critical' ? 'destructive' : 'secondary'}>
                {challenge.urgency}
              </Badge>
              <Badge variant={challenge.classification === 'red' ? 'destructive' : 
                             challenge.classification === 'yellow' ? 'default' : 'secondary'}>
                {challenge.classification.toUpperCase()}
              </Badge>
              {challenge.anonymous && <Badge variant="outline">Anonymous</Badge>}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{new Date(challenge.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-4">{challenge.description}</p>
        
        {challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {challenge.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Submitted by: {challenge.anonymous ? 'Anonymous User' : challenge.author?.username}
            {challenge.author?.verified_dod && ' (DoD Verified)'}
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedItem(selectedItem === challenge.id ? null : challenge.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Review
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => handleModeration(challenge.id, 'approve')}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleModeration(challenge.id, 'reject')}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleModeration(challenge.id, 'redact')}
            >
              <Edit className="h-4 w-4 mr-1" />
              Redact
            </Button>
          </div>
        </div>

        {selectedItem === challenge.id && (
          <div className="mt-4 p-4 bg-slate-50 rounded border">
            <h4 className="font-medium mb-2">Moderation Notes</h4>
            <Textarea
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              placeholder="Enter reason for rejection or redaction (optional for approval)..."
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-3">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleModeration(challenge.id, 'approve')}>
                Submit Decision
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">OPSEC Moderation Queue</h2>
        <div className="flex items-center space-x-4">
          <Badge variant="destructive">
            {pendingChallenges.length + pendingSolutions.length} items pending
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList>
          <TabsTrigger value="challenges">
            Challenges ({pendingChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="solutions">
            Solutions ({pendingSolutions.length})
          </TabsTrigger>
          <TabsTrigger value="guidelines">
            Guidelines
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <div className="space-y-4">
            {pendingChallenges.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No challenges pending review</p>
                </CardContent>
              </Card>
            ) : (
              pendingChallenges.map((challenge) => (
                <ChallengeItem key={challenge.id} challenge={challenge} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="solutions">
          <div className="space-y-4">
            {pendingSolutions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No solutions pending review</p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">Solutions moderation interface would be similar to challenges...</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle>OPSEC Moderation Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-red-600 mb-2">🔴 REJECT immediately if content contains:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Specific operational details, locations, or timelines</li>
                  <li>Classified information or technical specifications</li>
                  <li>Personnel names, unit designations, or deployment information</li>
                  <li>Sensitive vulnerabilities or capabilities</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-yellow-600 mb-2">🟡 REDACT portions that include:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Specific equipment models or technical details</li>
                  <li>Numerical values that could reveal capabilities</li>
                  <li>Geographic references beyond general regions</li>
                  <li>Organizational structure details</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-green-600 mb-2">🟢 APPROVE content that:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Describes general tactical challenges</li>
                  <li>Focuses on conceptual problems</li>
                  <li>Uses hypothetical scenarios</li>
                  <li>Maintains appropriate abstraction level</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModerationQueue;
