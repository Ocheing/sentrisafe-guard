import { Cloud, FileText, Heart, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDisguise } from '@/contexts/DisguiseContext';
import { cn } from '@/lib/utils';

const disguiseOptions = [
  { mode: 'none' as const, label: 'SentriSafe', description: 'Show real app', icon: Shield },
  { mode: 'weather' as const, label: 'WeatherNow', description: 'Weather app disguise', icon: Cloud },
  { mode: 'notes' as const, label: 'QuickNotes', description: 'Notes app disguise', icon: FileText },
  { mode: 'period' as const, label: 'CycleTracker', description: 'Period tracker disguise', icon: Heart },
];

const DisguiseSelector = () => {
  const { disguiseMode, setDisguiseMode } = useDisguise();

  return (
    <div className="grid grid-cols-2 gap-2">
      {disguiseOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = disguiseMode === option.mode;

        return (
          <Card
            key={option.mode}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              isSelected && 'ring-2 ring-primary border-primary'
            )}
            onClick={() => setDisguiseMode(option.mode)}
          >
            <CardContent className="pt-3 pb-3 text-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center',
                  isSelected ? 'bg-primary' : 'bg-muted'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5',
                    isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}
                />
              </div>
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DisguiseSelector;
