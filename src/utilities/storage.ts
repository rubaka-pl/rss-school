import { LOCAL_STORAGE_SEARCH_KEY } from './constants';

export function saveSearchTerm(term: string): void {
  localStorage.setItem(LOCAL_STORAGE_SEARCH_KEY, term);
}

export function loadSearchTerm(): string {
  return localStorage.getItem(LOCAL_STORAGE_SEARCH_KEY) ?? '';
}

export function clearSearchTerm(): void {
  localStorage.removeItem(LOCAL_STORAGE_SEARCH_KEY);
}
