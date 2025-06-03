import React, { useState, useRef, useEffect } from 'react';
import { Shield, Search, Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onMenuToggle: () => void;
  user?: any;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="text-white hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">StrikeStack</h1>
                <p className="text-xs text-slate-300">Drone White List Platform</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search challenges, solutions..."
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
                  <Bell className="h-5 w-5" />
                </Button>

                <div className="flex items-center space-x-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <div className="flex items-center space-x-1">
                      <Badge variant={user.verified_dod ? "default" : "secondary"} className="text-xs">
                        {user.verified_dod ? "DoD Verified" : user.role}
                      </Badge>
                      {user.verified_dod && (
                        <Shield className="h-3 w-3 text-green-400" />
                      )}
                    </div>
                  </div>

                  {/* Profile Icon with Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-slate-800"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <User className="h-5 w-5" />
                    </Button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-50 text-sm">
                        <div className="px-4 py-3 border-b">
                          <p className="font-medium text-slate-900">{user.username}</p>
                          <p className="text-slate-600 text-xs">{user.email}</p>
                        </div>
                        <div className="px-4 py-2 text-slate-700">
                          <p>Role: <span className="capitalize">{user.role}</span></p>
                          <p>Karma: {user.karma_points}</p>
                          <p>Verified: {user.verified_dod ? "Yes" : "No"}</p>
                        </div>
                        <div className="border-t px-4 py-2">
                          <button className="w-full text-left text-blue-600 hover:underline">
                            View Profile
                          </button>
                          <button className="w-full text-left text-red-600 hover:underline mt-1">
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
