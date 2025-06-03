
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Car, Plane, Building, Target, Truck, Package, CheckCircle } from 'lucide-react';

interface VictoryMarkingsProps {
  markings: {
    person?: number;
    tank?: number;
    aircraft?: number;
    building?: number;
    drone?: number;
    vehicle?: number;
    supply_run?: number;
    successful_delivery?: number;
  };
  className?: string;
}

const VictoryMarkings: React.FC<VictoryMarkingsProps> = ({ markings, className }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'person':
        return User;
      case 'tank':
      case 'vehicle':
        return Car;
      case 'aircraft':
      case 'drone':
        return Plane;
      case 'building':
        return Building;
      case 'supply_run':
        return Truck;
      case 'successful_delivery':
        return CheckCircle;
      default:
        return Target;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'person':
        return 'Personnel';
      case 'tank':
        return 'Armor';
      case 'aircraft':
        return 'Aircraft';
      case 'building':
        return 'Structures';
      case 'drone':
        return 'Drones';
      case 'vehicle':
        return 'Vehicles';
      case 'supply_run':
        return 'Supply Runs';
      case 'successful_delivery':
        return 'Deliveries';
      default:
        return 'Targets';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'person':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'tank':
      case 'vehicle':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'aircraft':
      case 'drone':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'building':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'supply_run':
      case 'successful_delivery':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const activeMarkings = Object.entries(markings).filter(([_, count]) => count && count > 0);

  if (activeMarkings.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {activeMarkings.map(([type, count]) => {
        const Icon = getIcon(type);
        const label = getLabel(type);
        const colorClass = getColor(type);
        
        return (
          <Badge
            key={type}
            variant="outline"
            className={`flex items-center gap-1 px-2 py-1 ${colorClass}`}
          >
            <Icon className="h-3 w-3" />
            <span className="font-mono text-xs font-bold">{count}×</span>
            <span className="text-xs">{label}</span>
          </Badge>
        );
      })}
    </div>
  );
};

export default VictoryMarkings;
