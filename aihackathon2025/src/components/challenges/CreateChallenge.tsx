
import React, { useState } from 'react';
import { Upload, Video, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClassificationLevel, UrgencyLevel } from '@/types';

interface CreateChallengeProps {
  onSubmit: (challenge: any) => void;
  userRole?: string;
}

const CreateChallenge: React.FC<CreateChallengeProps> = ({ onSubmit, userRole }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    tags: '',
    classification: 'green' as ClassificationLevel,
    urgency: 'medium' as UrgencyLevel,
    anonymous: false,
    videoUrl: ''
  });

  const domains = [
    'Air Domain',
    'Land Domain',
    'Maritime Domain',
    'Space Domain',
    'Cyber Domain',
    'Electronic Warfare',
    'Intelligence',
    'Logistics'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const challenge = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      author_id: 'current_user_id', // This would come from auth context
      moderation_status: 'pending',
      upvotes: 0,
      solution_count: 0
    };

    onSubmit(challenge);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      domain: '',
      tags: '',
      classification: 'green',
      urgency: 'medium',
      anonymous: false,
      videoUrl: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Submit New Challenge</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Classification Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">OPSEC Review Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    All submissions are reviewed for operational security compliance before publication.
                    Avoid including classified information, specific locations, or sensitive operational details.
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief, descriptive title of the tactical problem..."
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed context, constraints, and requirements. What specific problem needs solving?"
                rows={6}
                required
              />
            </div>

            {/* Metadata Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain *</Label>
                <Select value={formData.domain} onValueChange={(value) => setFormData({ ...formData, domain: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain..." />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value as UrgencyLevel })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classification">Classification</Label>
                <Select value={formData.classification} onValueChange={(value) => setFormData({ ...formData, classification: value as ClassificationLevel })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">🟢 Unclassified</SelectItem>
                    <SelectItem value="yellow">🟡 Sensitive</SelectItem>
                    {userRole === 'warfighter' && (
                      <SelectItem value="red">🔴 Classified</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Comma-separated tags (e.g., UAV, reconnaissance, urban)"
              />
              <p className="text-xs text-muted-foreground">
                Use relevant keywords to help others find your challenge
              </p>
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video Overview (Optional)</Label>
              <div className="flex space-x-2">
                <Video className="h-4 w-4 mt-3 text-muted-foreground" />
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="YouTube, Vimeo, or secure video link..."
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="anonymous">Anonymous Submission</Label>
                  <p className="text-sm text-muted-foreground">
                    Hide your identity from other users (moderators can still see it)
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => setFormData({ ...formData, anonymous: checked })}
                />
              </div>
            </div>

            {/* Classification Preview */}
            {formData.classification !== 'green' && (
              <div className="space-y-2">
                <Label>Classification Preview</Label>
                <div className={`p-3 rounded border-l-4 ${
                  formData.classification === 'red' 
                    ? 'border-l-red-500 bg-red-50' 
                    : 'border-l-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Badge variant={formData.classification === 'red' ? 'destructive' : 'default'}>
                      {formData.classification === 'red' ? '🔴 CLASSIFIED' : '🟡 SENSITIVE'}
                    </Badge>
                    <span className="text-sm">
                      This content will require additional review and restricted access.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                * Required fields
              </p>
              
              <div className="space-x-3">
                <Button type="button" variant="outline">
                  Save Draft
                </Button>
                <Button type="submit">
                  Submit for Review
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateChallenge;
