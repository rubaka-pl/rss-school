import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../api/pokemonApi', () => ({
  fetchPage: vi.fn().mockResolvedValue({ results: [], count: 0 }),
  fetchPokemonList: vi.fn().mockResolvedValue(['pikachu', 'charmander']),
  fetchFullPokemonDataByName: vi.fn().mockResolvedValue([]),
}));

vi.mock('../components/TopSection/TopSection', () => ({
  default: ({ onSearch }: { onSearch(term: string): void }) => (
    <button data-testid="search-btn" onClick={() => onSearch('pi')}>
      Search
    </button>
  ),
}));

vi.mock('../components/BottomSection/BottomSection', () => ({
  default: () => <div data-testid="bottom" />,
}));

vi.mock('../components/Pagination/Pagination', () => ({
  default: () => <div data-testid="pager" />,
}));

vi.mock('../components/Cursor/Cursor', () => ({
  default: () => <div data-testid="cursor" />,
}));

vi.mock('../components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../components/BuggyBottom/BuggyBottom', () => ({
  default: () => <div data-testid="buggy" />,
}));

import App from '../App';

describe('App (simplified)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('on mount, fetchPokemonList then fetchPage(0)', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const { fetchPokemonList, fetchPage } = await import('../api/pokemonApi');
    expect(fetchPokemonList).toHaveBeenCalled();
    await waitFor(() => expect(fetchPage).toHaveBeenCalledWith(0));
  });

  it('uses saved searchTerm to skip pagination', async () => {
    localStorage.setItem('searchTerm', 'pikachu');
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByTestId('bottom')).toBeInTheDocument();
    expect(screen.queryByTestId('pager')).toBeNull();
  });

  it('shows pager when no searchTerm and count > pageSize', async () => {
    const api = await import('../api/pokemonApi');
    const fetchPage = api.fetchPage as MockedFunction<typeof api.fetchPage>;
    fetchPage.mockResolvedValueOnce({ results: [], count: 30 });
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => expect(fetchPage).toHaveBeenCalled());
    expect(screen.getByTestId('pager')).toBeInTheDocument();
  });

  it('triggers search and renders bottom when Search button clicked', async () => {
    const { fetchFullPokemonDataByName } = await import('../api/pokemonApi');
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByTestId('search-btn'));
    expect(fetchFullPokemonDataByName).toHaveBeenCalledWith('pikachu');
    // bottom still visible after search
    expect(await screen.findByTestId('bottom')).toBeInTheDocument();
  });
});
