import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  soundEnabled: boolean;
  onToggle: () => void;
}

export const SoundToggle = ({ soundEnabled, onToggle }: SoundToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Sound</span>
      <button
        onClick={onToggle}
        className="p-2 rounded-md hover:bg-accent transition-colors"
        aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
      >
        {soundEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};
