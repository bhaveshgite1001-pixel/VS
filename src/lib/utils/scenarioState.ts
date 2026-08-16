'use client';

export interface SavedScenario<T = Record<string, any>> {
  id: string;
  engineId: string;
  name: string;
  notes?: string;
  createdAt: string;
  inputs: T;
}

const STORAGE_KEY = 'dside_saved_scenarios_v1';

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
      if (rawVal !== null) {
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

// LocalStorage Persistence Helpers
export function getSavedScenarios<T>(engineId: string): SavedScenario<T>[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const allScenarios: SavedScenario<T>[] = JSON.parse(raw);
    return allScenarios.filter((s) => s.engineId === engineId);
  } catch (e) {
    console.error('Failed to load scenarios from localStorage:', e);
    return [];
  }
}

export function saveScenario<T>(engineId: string, name: string, inputs: T, notes?: string): SavedScenario<T> {
  const newScenario: SavedScenario<T> = {
    id: `${engineId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    engineId,
    name: name.trim() || 'Untitled Scenario',
    notes: notes?.trim() || '',
    createdAt: new Date().toISOString(),
    inputs,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: SavedScenario<any>[] = raw ? JSON.parse(raw) : [];
    const updated = [newScenario, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save scenario to localStorage:', e);
  }

  return newScenario;
}

export function deleteScenario(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const existing: SavedScenario<any>[] = JSON.parse(raw);
    const updated = existing.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete scenario:', e);
  }
}

export function duplicateScenario<T>(id: string): SavedScenario<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const existing: SavedScenario<T>[] = JSON.parse(raw);
    const target = existing.find((s) => s.id === id);
    if (!target) return null;

    const copy: SavedScenario<T> = {
      ...target,
      id: `${target.engineId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([copy, ...existing]));
    return copy;
  } catch (e) {
    console.error('Failed to duplicate scenario:', e);
    return null;
  }
}

// Backup Export & Import JSON
export function exportWorkspaceBackupJson(): string {
  if (typeof window === 'undefined') return '{}';
  const raw = localStorage.getItem(STORAGE_KEY) || '[]';
  return JSON.stringify({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    scenarios: JSON.parse(raw),
  }, null, 2);
}

export function importWorkspaceBackupJson(jsonString: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.scenarios)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.scenarios));
      return true;
    }
  } catch (e) {
    console.error('Failed to import scenario JSON:', e);
  }
  return false;
}
