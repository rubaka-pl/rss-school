import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, afterEach, beforeEach, describe, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import HomePage from '../pages/HomePage/HomePage';
import { Provider } from 'react-redux';
import { store } from '../store/store';

vi.mock('../api/pokemonApi', async (importOriginal) => {
  const original = await importOriginal<typeof import('../api/pokemonApi')>();
  return {
    ...original,
    pokemonApi: {
      ...original.pokemonApi,
      endpoints: {
        ...original.pokemonApi.endpoints,
        getAllPokemonNames: {
          useQuery: vi.fn(() => ({
            data: ['pikachu', 'bulbasaur'],
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
          })),
        },
        getPokemonPage: {
          useQuery: vi.fn(() => ({
            data: {
              results: [{ name: 'pikachu' }, { name: 'bulbasaur' }],
              count: 2,
            },
            isLoading: false,
            isError: false,
          })),
        },
        getPokemonDetails: {
          useQuery: vi.fn(() => ({
            data: {
              name: 'pikachu',
              sprites: { front_default: 'url' },
              stats: [],
              types: [],
              abilities: [],
            },
            isLoading: false,
            isError: false,
          })),
        },
      },
    },
  };
});
vi.mock('../components/TopSection/TopSection', () => ({
  default: ({ onSearch }: { onSearch: (term: string) => void }) => (
    <button data-testid="search-btn" onClick={() => onSearch('pikachu')}>
      Search
    </button>
  ),
}));

vi.mock('../components/BottomSection/BottomSection', () => ({
  default: () => <div data-testid="bottom-section">Bottom Section</div>,
}));

vi.mock('../components/Cursor/Cursor', () => ({
  default: () => <div data-testid="cursor" />,
}));

vi.mock('../components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../components/BuggyBottom/BuggyBottom', () => ({
  default: () => <div data-testid="buggy-bottom" />,
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders HomePage and loads pager', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/']}>
            <HomePage />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  });

  it('search triggers and renders bottom section', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/']}>
            <HomePage />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    await user.click(screen.getByTestId('search-btn'));
  });
});
