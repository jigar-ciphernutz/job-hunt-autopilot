// Storage module - wraps localStorage so it can be swapped for Firestore later

import type { AppState } from './types';

const STORAGE_KEY = 'job_hunt_autopilot_v1';

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[storage] Failed to save state', e);
  }
}

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch (e) {
    console.error('[storage] Failed to load state', e);
    return null;
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

// Cache for classification results: keyed by emailId + contentHash
const CACHE_KEY = 'job_hunt_classification_cache_v1';

export interface CacheEntry {
  contentHash: string;
  classification: import('./types').Classification;
}

export function loadCache(): Record<number, CacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<number, CacheEntry>;
  } catch {
    return {};
  }
}

export function saveCache(cache: Record<number, CacheEntry>): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('[storage] Failed to save cache', e);
  }
}

// Simple hash for cache invalidation
export function hashEmailContent(email: import('./types').RawEmail): string {
  const content = `${email.from}|${email.subject}|${email.date}|${email.body}`;
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
