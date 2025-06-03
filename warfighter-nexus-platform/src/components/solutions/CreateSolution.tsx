
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TRLLevel, UserRole } from '@/types';
import { X, Upload, Plus } from 'lucide-react';

interface CreateSolutionProps {
  onSubmit: (solution: any) => void;
  userRole: UserRole;
}

const CreateSolution: React.FC<CreateSolutionProps> = ({ onSubmit, userRole }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trl_level: 1 as TRLLevel,
    challenge_id: '',
    video_url: '',
    attachments: [] as string[],
    tags: [] as string[],
    victory_markings: {
      person: 0,
      tank: 0,
      aircraft: 0,
      building: 0,
      drone: 0,
      vehicle: 0,
      supply_run: 0,
      successful_delivery: 0
    },
    effectiveness_rating: 0,
    deployment_cost: 0
  });

  const [newTag, setNewTag] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      author_id: '1', // Mock user ID
      upvotes: 0,
      moderation_status: 'pending'
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addAttachment = () => {
    if (newAttachment.trim() && !formData.attachments.includes(newAttachment.trim())) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()]
      }));
      setNewAttachment('');
    }
  };

  const removeAttachment = (attachmentToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att !== attachmentToRemove)
    }));
  };

  const updateVictoryMarking = (type: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      victory_markings: {
        ...prev.victory_markings,
        [type]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Solution Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter solution title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge_id">Related Challenge ID</Label>
                <Input
                  id="challenge_id"
                  value={formData.challenge_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, challenge_id: e.target.value }))}
                  placeholder="Link to specific challenge"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of your solution"
                rows={4}
                required
              />
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trl_level">TRL Level *</Label>
                <Select
                  value={formData.trl_level.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, trl_level: parseInt(value) as TRLLevel }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select TRL" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                      <SelectItem key={level} value={level.toString()}>
                        TRL {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveness_rating">Effectiveness Rating (1-10)</Label>
                <Input
                  id="effectiveness_rating"
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={formData.effectiveness_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveness_rating: parseFloat(e.target.value) }))}
                  placeholder="8.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deployment_cost">Deployment Cost ($)</Label>
                <Input
                  id="deployment_cost"
                  type="number"
                  value={formData.deployment_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, deployment_cost: parseInt(e.target.value) }))}
                  placeholder="150000"
                />
              </div>
            </div>

            {/* Victory Markings */}
            <div className="space-y-4">
              <Label>Victory Markings (Proven Effectiveness)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.victory_markings).map(([type, count]) => (
                  <div key={type} className="space-y-2">
                    <Label htmlFor={type} className="text-sm capitalize">
                      {type.replace('_', ' ')}
                    </Label>
                    <Input
                      id={type}
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) => updateVictoryMarking(type, parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Media & Attachments */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video_url">Demo Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://example.com/demo-video"
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="flex gap-2">
                  <Input
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    placeholder="Add attachment filename"
                  />
                  <Button type="button" onClick={addAttachment} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.attachments.map((attachment) => (
                    <Badge key={attachment} variant="secondary" className="flex items-center gap-1">
                      {attachment}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeAttachment(attachment)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Save Draft
              </Button>
              <Button type="submit">
                Submit for Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSolution;
