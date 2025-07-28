import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';

vi.mock('../api/pokemonApi', () => ({
  fetchPage: vi.fn().mockResolvedValue({ results: [], count: 0 }),
  fetchPokemonList: vi.fn().mockResolvedValue(['pikachu', 'charmander']),
  fetchDetailedPokemonData: vi.fn().mockResolvedValue([]),
}));
vi.mock('../api/pokemonDetailed', () => ({
  fetchDetailedPokemonData: vi.fn().mockResolvedValue({
    name: 'Pikachu',
    animatedImageUrl: 'https://example.com/pikachu.gif',
    imageUrl: 'https://example.com/pikachu.png',
    description: 'Electric type Pokémon.',
    baseExperience: 112,
    height: 40,
    weight: 600,
    types: ['Electric'],
    abilities: ['Static', 'Lightning Rod'],
    color: 'Yellow',
    habitat: 'Forest',
    isLegendary: false,
    isMythical: false,
    stats: [
      { name: 'hp', value: 35 },
      { name: 'attack', value: 55 },
    ],
  }),
}));

vi.mock('../components/TopSection/TopSection', () => ({
  default: ({
    onSearch,
    onError,
  }: {
    onSearch(term: string): void;
    onError(): void;
  }) => (
    <>
      <button data-testid="search-btn" onClick={() => onSearch('pik')}>
        Search
      </button>
      <button data-testid="error-btn" onClick={onError}>
        Trigger Error
      </button>
    </>
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
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    const { fetchPokemonList, fetchPage } = await import('../api/pokemonApi');
    expect(fetchPokemonList).toHaveBeenCalled();
    await waitFor(() => expect(fetchPage).toHaveBeenCalledWith(0));
  });

  it('uses saved searchTerm to skip pagination', async () => {
    localStorage.setItem('searchTerm', 'pikachu');
    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(await screen.findByTestId('bottom')).toBeInTheDocument();
    expect(screen.queryByTestId('pager')).toBeNull();
  });

  it('shows pager when no searchTerm and count > pageSize', async () => {
    const api = await import('../api/pokemonApi');
    const fetchPage = api.fetchPage as MockedFunction<typeof api.fetchPage>;
    fetchPage.mockResolvedValueOnce({ results: [], count: 30 });
    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    await waitFor(() => expect(fetchPage).toHaveBeenCalled());
    expect(screen.getByTestId('pager')).toBeInTheDocument();
  });

  it('triggers search and renders bottom when Search button clicked', async () => {
    const { fetchDetailedPokemonData } = await import('../api/pokemonDetailed');
    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId('search-btn'));
    expect(fetchDetailedPokemonData).toHaveBeenCalledWith('pikachu');
    expect(await screen.findByTestId('bottom')).toBeInTheDocument();
  });
});

it('shows BuggyBottom when onErrorButton is triggered', async () => {
  render(
    <ThemeProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </ThemeProvider>
  );

  const errorButton = await screen.findByTestId('error-btn');
  await userEvent.click(errorButton);

  expect(await screen.findByTestId('buggy')).toBeInTheDocument();
});

it('loads and renders DetailsData when ?details param is present', async () => {
  const url = new URLSearchParams({ details: 'pikachu' });
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[`/?${url.toString()}`]}>
        <App />
      </MemoryRouter>
    </ThemeProvider>
  );

  expect(await screen.findByText('Pikachu')).toBeInTheDocument();

  const closeBtn = screen.getByRole('button', { name: /✖/ });
  await userEvent.click(closeBtn);
  expect(screen.queryByText('Pikachu')).not.toBeInTheDocument();
});
