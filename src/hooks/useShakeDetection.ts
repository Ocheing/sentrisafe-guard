import { useEffect, useCallback, useRef } from 'react';

interface ShakeDetectionOptions {
  threshold?: number;
  timeout?: number;
  onShake: () => void;
}

export const useShakeDetection = ({
  threshold = 15,
  timeout = 1000,
  onShake,
}: ShakeDetectionOptions) => {
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const lastZ = useRef<number | null>(null);
  const lastTime = useRef<number>(0);
  const shakeCount = useRef<number>(0);

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      if (x === null || y === null || z === null) return;

      const currentTime = Date.now();

      if (lastX.current !== null && lastY.current !== null && lastZ.current !== null) {
        const deltaX = Math.abs(x - lastX.current);
        const deltaY = Math.abs(y - lastY.current);
        const deltaZ = Math.abs(z - lastZ.current);

        if (deltaX + deltaY + deltaZ > threshold) {
          shakeCount.current++;

          if (shakeCount.current >= 3) {
            onShake();
            shakeCount.current = 0;
          }
        }
      }

      // Reset shake count after timeout
      if (currentTime - lastTime.current > timeout) {
        shakeCount.current = 0;
      }

      lastX.current = x;
      lastY.current = y;
      lastZ.current = z;
      lastTime.current = currentTime;
    },
    [threshold, timeout, onShake]
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [handleMotion]);
};
