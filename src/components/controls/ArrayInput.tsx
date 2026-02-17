import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { ListOrdered } from 'lucide-react';

interface ArrayInputProps {
  onSetCustomArray: (arr: number[]) => void;
}

export const ArrayInput = ({ onSetCustomArray }: ArrayInputProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const errorTimerRef = useRef<number | null>(null);

  const showError = (msg: string) => {
    if (errorTimerRef.current !== null) clearTimeout(errorTimerRef.current);
    setError(msg);
    errorTimerRef.current = window.setTimeout(() => setError(''), 3000);
  };

  const handleSubmit = () => {
    setError('');

    const trimmed = value.trim();
    if (!trimmed) {
      showError('Enter comma-separated numbers like 5,3,8,1');
      return;
    }

    const parts = trimmed.split(',');
    const numbers = parts.map((s) => Number(s.trim()));

    if (numbers.some((n) => isNaN(n) || !Number.isFinite(n))) {
      showError('Enter comma-separated numbers like 5,3,8,1');
      return;
    }

    if (numbers.some((n) => n < 1 || n > 999 || !Number.isInteger(n))) {
      showError('Values must be integers between 1 and 999');
      return;
    }

    if (numbers.length < 2 || numbers.length > 100) {
      showError('Array must have between 2 and 100 elements');
      return;
    }

    onSetCustomArray(numbers);
    setError('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Custom Array</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          placeholder="5,3,8,1,9"
          className="flex-1 min-w-0 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button onClick={handleSubmit} variant="outline" size="sm">
          <ListOrdered className="mr-1 h-4 w-4" />
          Set
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
