
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface SolutionSearchProps {
  onSearch: (query: string, filters: any) => void;
}

const SolutionSearch: React.FC<SolutionSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    trlLevel: '',
    effectivenessRating: '',
    tags: [] as string[]
  });

  const commonTags = [
    'autonomous', 'ai', 'reconnaissance', 'counter-uas', 'swarm', 
    'defense', 'logistics', 'stealth', 'directed-energy', 'supply'
  ];

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      const newTags = [...filters.tags, tag];
      handleFilterChange('tags', newTags);
    }
  };

  const removeTag = (tag: string) => {
    const newTags = filters.tags.filter(t => t !== tag);
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const emptyFilters = {
      trlLevel: '',
      effectivenessRating: '',
      tags: []
    };
    setFilters(emptyFilters);
    onSearch(query, emptyFilters);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search solutions by title, description, or tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">TRL Level</label>
                  <Select
                    value={filters.trlLevel}
                    onValueChange={(value) => handleFilterChange('trlLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any TRL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any TRL</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          TRL {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Effectiveness Rating</label>
                  <Select
                    value={filters.effectivenessRating}
                    onValueChange={(value) => handleFilterChange('effectivenessRating', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any rating</SelectItem>
                      <SelectItem value="8">8.0+ (Excellent)</SelectItem>
                      <SelectItem value="7">7.0+ (Good)</SelectItem>
                      <SelectItem value="6">6.0+ (Fair)</SelectItem>
                      <SelectItem value="5">5.0+ (Basic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Tag Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Tags</label>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <Button
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                
                {filters.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {filters.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SolutionSearch;
