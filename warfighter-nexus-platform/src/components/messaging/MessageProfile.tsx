
import React from 'react';
import { Star, Shield, Calendar, MessageCircle, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User } from '@/types';

interface MessageProfileProps {
  user: User;
}

const MessageProfile: React.FC<MessageProfileProps> = ({ user }) => {
  const roleColors = {
    warfighter: 'bg-green-100 text-green-800',
    solution_provider: 'bg-blue-100 text-blue-800',
    moderator: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <Card>
        <CardHeader className="text-center pb-3">
          <Avatar className="h-16 w-16 mx-auto mb-3">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-lg">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-semibold">{user.username}</h3>
          
          <div className="flex items-center justify-center space-x-2">
            <Badge className={roleColors[user.role]}>
              {user.role.replace('_', ' ')}
            </Badge>
            {user.verified_dod && (
              <Badge variant="outline" className="text-green-600">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{user.karma_points} karma points</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>Last active {new Date(user.last_active).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          <Star className="h-4 w-4 mr-2" />
          View Profile
        </Button>
        
        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
          <UserX className="h-4 w-4 mr-2" />
          Block User
        </Button>
      </div>

      {/* Conversation Info */}
      <Card>
        <CardHeader>
          <h4 className="font-medium">Conversation</h4>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a private conversation between you and {user.username}. 
            Messages are only visible to participants.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageProfile;
