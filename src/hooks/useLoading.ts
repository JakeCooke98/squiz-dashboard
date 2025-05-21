import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Options for the useLoading hook
 */
interface UseLoadingOptions {
  /** Minimum loading time in milliseconds to prevent flashing */
  minLoadingTime?: number;
  /** Delay before showing the loading state in milliseconds */
  loadingDelay?: number;
  /** Initial loading state */
  initialState?: boolean;
}

/**
 * Custom hook for managing loading states with controlled transitions
 * 
 * Features:
 * - Minimum loading time to prevent flickering
 * - Delayed loading state to prevent flashing for fast operations
 * - Controlled transitions for smooth UX
 */
export function useLoading({
  minLoadingTime = 600,
  loadingDelay = 200,
  initialState = false,
}: UseLoadingOptions = {}) {
  // Actual loading state
  const [isLoading, setIsLoading] = useState(initialState);
  // Visible loading state (may differ from actual due to delays/minimums)
  const [showLoading, setShowLoading] = useState(initialState);
  
  // Use refs for timers to prevent issues with stale closures
  const timerRef = useRef<{
    startTime: number | null;
    delayTimer: NodeJS.Timeout | null;
    minLoadingTimer: NodeJS.Timeout | null;
  }>({
    startTime: initialState ? Date.now() : null,
    delayTimer: null,
    minLoadingTimer: null,
  });
  
  // Function to start loading
  const startLoading = useCallback(() => {
    // Clear any existing timers first
    if (timerRef.current.delayTimer) clearTimeout(timerRef.current.delayTimer);
    if (timerRef.current.minLoadingTimer) clearTimeout(timerRef.current.minLoadingTimer);
    
    setIsLoading(true);
    
    // Use a delay to avoid flashing the loading state for fast operations
    const delayTimer = setTimeout(() => {
      setShowLoading(true);
    }, loadingDelay);
    
    timerRef.current = {
      startTime: Date.now(),
      delayTimer,
      minLoadingTimer: null,
    };
  }, [loadingDelay]);
  
  // Function to stop loading
  const stopLoading = useCallback(() => {
    // Clear the delay timer if it exists
    if (timerRef.current.delayTimer) {
      clearTimeout(timerRef.current.delayTimer);
      timerRef.current.delayTimer = null;
    }
    
    const currentTime = Date.now();
    const loadingStartTime = timerRef.current.startTime || currentTime;
    const timeElapsed = currentTime - loadingStartTime;
    
    // If we haven't shown loading yet and haven't passed the min time, don't show it at all
    if (!showLoading && timeElapsed < loadingDelay) {
      setIsLoading(false);
      timerRef.current.startTime = null;
      return;
    }
    
    // If we need to fulfill the minimum loading time, set a timer
    if (timeElapsed < minLoadingTime) {
      const remainingTime = minLoadingTime - timeElapsed;
      
      const minLoadingTimer = setTimeout(() => {
        setIsLoading(false);
        setShowLoading(false);
        timerRef.current.minLoadingTimer = null;
        timerRef.current.startTime = null;
      }, remainingTime);
      
      timerRef.current.minLoadingTimer = minLoadingTimer;
    } else {
      // We've already passed the minimum loading time, stop immediately
      setIsLoading(false);
      setShowLoading(false);
      timerRef.current.startTime = null;
    }
  }, [loadingDelay, minLoadingTime, showLoading]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current.delayTimer) clearTimeout(timerRef.current.delayTimer);
      if (timerRef.current.minLoadingTimer) clearTimeout(timerRef.current.minLoadingTimer);
    };
  }, []);
  
  return {
    isLoading,
    showLoading,
    startLoading,
    stopLoading,
  };
} 