'use client';

import { useState, useEffect, useRef } from 'react';

// URL Parameter Serialization & Deserialization
export function serializeInputsToUrl<T extends Record<string, any>>(inputs: T): string {
  if (typeof window === 'undefined') return '';
  const searchParams = new URLSearchParams();
  Object.entries(inputs).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      searchParams.set(key, String(val));
    }
  });
  return searchParams.toString();
}

export function deserializeInputsFromUrl<T extends Record<string, any>>(defaultInputs: T): T {
  if (typeof window === 'undefined') return defaultInputs;
  const searchParams = new URLSearchParams(window.location.search);
  const result: Record<string, any> = { ...defaultInputs };
  
  let hasMatch = false;
  Object.keys(defaultInputs).forEach((key) => {
    if (searchParams.has(key)) {
      const rawVal = searchParams.get(key);
      if (rawVal !== null && rawVal !== '') {
        hasMatch = true;
        const defaultVal = defaultInputs[key];
        if (typeof defaultVal === 'number') {
          const num = Number(rawVal);
          if (!isNaN(num)) result[key] = num;
        } else if (typeof defaultVal === 'boolean') {
          result[key] = rawVal === 'true';
        } else {
          result[key] = rawVal;
        }
      }
    }
  });

  return hasMatch ? (result as T) : defaultInputs;
}

// React Custom Hook for Hydrating Inputs from URL and Syncing Changes
export function useScenarioInputs<T extends Record<string, any>>(defaultInputs: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [inputs, setInputs] = useState<T>(defaultInputs);
  const [isMounted, setIsMounted] = useState(false);
  const isFirstSync = useRef(true);

  // 1. Hydrate from URL after initial mount (prevents SSR hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && window.location.search) {
      const hydrated = deserializeInputsFromUrl(defaultInputs);
      setInputs(hydrated);
    }
  }, []);

  // 2. Update URL query params when inputs change after mount
  useEffect(() => {
    if (!isMounted) return;
    if (isFirstSync.current) {
      isFirstSync.current = false;
      return;
    }
    if (typeof window !== 'undefined') {
      const queryString = serializeInputsToUrl(inputs);
      const newUrl = `${window.location.pathname}?${queryString}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [inputs, isMounted]);

  return [inputs, setInputs];
}
