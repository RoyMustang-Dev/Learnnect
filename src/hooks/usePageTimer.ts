import { useState, useEffect, useRef } from 'react';

interface UsePageTimerOptions {
  onTimeReached?: (timeSpent: number) => void;
  targetTime?: number; // in milliseconds
  trackVisibility?: boolean; // Track if page is visible
}

export const usePageTimer = (options: UsePageTimerOptions = {}) => {
  const {
    onTimeReached,
    targetTime = 10000, // 10 seconds default
    trackVisibility = true
  } = options;

  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  // Handle visibility change
  useEffect(() => {
    if (!trackVisibility) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // Accumulate time spent so far
        accumulatedTimeRef.current += Date.now() - startTimeRef.current;
        setIsActive(false);
      } else {
        // Page is visible, resume timer
        startTimeRef.current = Date.now();
        setIsActive(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackVisibility]);

  // Main timer effect
  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const sessionTime = currentTime - startTimeRef.current;
      const totalTime = accumulatedTimeRef.current + sessionTime;
      
      setTimeSpent(totalTime);

      // Check if target time is reached
      if (!hasReachedTarget && totalTime >= targetTime) {
        setHasReachedTarget(true);
        onTimeReached?.(totalTime);
      }
    }, 100); // Update every 100ms for smooth tracking

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, targetTime, hasReachedTarget, onTimeReached]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const resetTimer = () => {
    setTimeSpent(0);
    setHasReachedTarget(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = Date.now();
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    accumulatedTimeRef.current += Date.now() - startTimeRef.current;
    setIsActive(false);
  };

  const resumeTimer = () => {
    startTimeRef.current = Date.now();
    setIsActive(true);
  };

  return {
    timeSpent,
    isActive,
    hasReachedTarget,
    resetTimer,
    pauseTimer,
    resumeTimer,
    // Utility functions
    timeSpentInSeconds: Math.floor(timeSpent / 1000),
    timeSpentInMinutes: Math.floor(timeSpent / 60000),
    progressToTarget: Math.min((timeSpent / targetTime) * 100, 100)
  };
};

export default usePageTimer;
