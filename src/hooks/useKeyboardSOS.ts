import { useEffect, useCallback, useRef } from 'react';

interface KeyboardSOSOptions {
  pattern?: string[];
  timeout?: number;
  onSOS: () => void;
}

export const useKeyboardSOS = ({
  pattern = ['s', 'o', 's'],
  timeout = 2000,
  onSOS,
}: KeyboardSOSOptions) => {
  const pressedKeys = useRef<string[]>([]);
  const lastKeyTime = useRef<number>(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const currentTime = Date.now();
      const key = event.key.toLowerCase();

      // Reset if too much time passed
      if (currentTime - lastKeyTime.current > timeout) {
        pressedKeys.current = [];
      }

      pressedKeys.current.push(key);
      lastKeyTime.current = currentTime;

      // Check if pattern matches
      const recentKeys = pressedKeys.current.slice(-pattern.length);
      if (recentKeys.length === pattern.length && 
          recentKeys.every((k, i) => k === pattern[i])) {
        onSOS();
        pressedKeys.current = [];
      }

      // Keep only recent keys
      if (pressedKeys.current.length > 10) {
        pressedKeys.current = pressedKeys.current.slice(-5);
      }
    },
    [pattern, timeout, onSOS]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
