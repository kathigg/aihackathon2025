
import React from 'react';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import { ClassificationLevel } from '@/types';
import { cn } from '@/lib/utils';

interface ClassificationBannerProps {
  level: ClassificationLevel;
  className?: string;
}

const ClassificationBanner: React.FC<ClassificationBannerProps> = ({ level, className }) => {
  const config = {
    red: {
      bg: 'bg-red-600',
      text: 'text-white',
      icon: AlertTriangle,
      label: 'CLASSIFIED',
      description: 'Restricted Access - DoD Personnel Only'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-black',
      icon: Shield,
      label: 'SENSITIVE',
      description: 'Controlled Information - Moderated Content'
    },
    green: {
      bg: 'bg-green-600',
      text: 'text-white',
      icon: Info,
      label: 'UNCLASSIFIED',
      description: 'Public Information - Open Access'
    }
  };

  const { bg, text, icon: Icon, label, description } = config[level];

  return (
    <div className={cn(
      "px-4 py-2 flex items-center justify-center space-x-2",
      bg,
      text,
      className
    )}>
      <Icon className="h-4 w-4" />
      <span className="font-bold text-sm">{label}</span>
      <span className="text-sm opacity-90">-</span>
      <span className="text-sm opacity-90">{description}</span>
    </div>
  );
};

export default ClassificationBanner;
