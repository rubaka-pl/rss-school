import type { SetURLSearchParams } from 'react-router-dom';
import type { DetailedResult } from './pokemon';
export interface Result {
  name: string;
  description: string;
  imageUrl: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
}

export interface AppState {
  results: Result[];
  loading: boolean;
  errorMessage: string | null;
  offset: number;
  count: number;
  searchTerm: string;
  showBuggyComponent: boolean;
  pokemonNames: string[];
}

export interface TopSectionState {
  searchTerm: string;
  suggestions: string[];
}

export interface TopSectionProps {
  onSearch(term: string): void;
  loading: boolean;
  onReset: () => void;
  onError: () => void;
}

export interface ButtonProps {
  onClick(): void;
  children: React.ReactNode;
}

export interface BottomSectionProps {
  results: Result[];
  onErrorButton(): void;
  onResetButton(): void;
  setSearchParams: SetURLSearchParams;
  searchParams: URLSearchParams;
  onRefresh(): void;
  isRefreshing: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  componentStack: string;
}
export interface SearchInputProps {
  value: string;
  onChange(term: string): void;
  onSearch(): void;
  suggestions: string[];
  onSuggestionClick(name: string): void;
}

export interface PaginationProps {
  offset: number;
  total: number;
  pageSize: number;
  onPageChange(offset: number): void;
}

export interface SearchProps {
  onResults(results: Result[], count: number, offset: number): void;
  pageSize: number;
}
export interface PropsDetails {
  data: DetailedResult;
  onClose: () => void;
}
export interface SelectedItem {
  id: string;
  name: string;
  description: string;
  detailsUrl: string;
}
export interface State {
  items: Record<string, SelectedItem>;
}
