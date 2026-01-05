import { useNavigate } from 'react-router-dom';
import { Shield, Cloud, FileText, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDisguise } from '@/contexts/DisguiseContext';
import ThemeToggle from './ThemeToggle';

interface DisguisedHeaderProps {
  showBack?: boolean;
  backTo?: string;
}

const iconMap = {
  shield: Shield,
  cloud: Cloud,
  'file-text': FileText,
  heart: Heart,
};

const DisguisedHeader = ({ showBack = false, backTo = '/dashboard' }: DisguisedHeaderProps) => {
  const navigate = useNavigate();
  const { appName, appIcon, isDisguised } = useDisguise();

  const IconComponent = iconMap[appIcon as keyof typeof iconMap] || Shield;

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={() => navigate(backTo)} className="mr-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isDisguised ? 'bg-secondary' : 'bg-primary'
          }`}>
            <IconComponent className={`w-4 h-4 ${isDisguised ? 'text-secondary-foreground' : 'text-primary-foreground'}`} />
          </div>
          <h1 className={`text-lg font-bold ${isDisguised ? 'text-foreground' : 'text-primary'}`}>
            {appName}
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default DisguisedHeader;
