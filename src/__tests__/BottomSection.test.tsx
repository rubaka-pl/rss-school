import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import BottomSection from '../components/BottomSection/BottomSection';
import type { Result } from '../types/app';
import { MemoryRouter } from 'react-router-dom';

describe('BottomSection', () => {
  const onResetButton = vi.fn();
  const onErrorButton = vi.fn();
  const mockSetSearchParams = vi.fn();
  const mockSearchParams = new URLSearchParams();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when results is empty', () => {
    render(
      <MemoryRouter>
        <BottomSection
          results={[]}
          onResetButton={onResetButton}
          onErrorButton={onErrorButton}
          setSearchParams={mockSetSearchParams}
          searchParams={mockSearchParams}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('This is a Pokémon search.')).toBeInTheDocument();
    expect(
      screen.getByText(/Try one of: Pikachu, Charmander, Bulbasaur, Squirtle\./)
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders table rows correctly when results are provided', () => {
    const results: Result[] = [
      {
        name: 'Testmon',
        imageUrl: 'http://img',
        description: 'A test Pokémon',
        height: 40,
        weight: 60,
        types: ['fire', 'flying'],
        abilities: ['blaze', 'solar-power'],
      },
    ];

    render(
      <MemoryRouter>
        <BottomSection
          results={results}
          onResetButton={onResetButton}
          onErrorButton={onErrorButton}
          setSearchParams={mockSetSearchParams}
          searchParams={mockSearchParams}
        />
      </MemoryRouter>
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    expect(screen.getByText('Pokemon')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();

    const img = screen.getByRole('img', { name: 'Testmon' });
    expect(img).toHaveAttribute('src', 'http://img');

    expect(screen.getByText('Testmon')).toBeInTheDocument();
    expect(screen.getByText('A test Pokémon')).toBeInTheDocument();
    expect(screen.getByText('4 m')).toBeInTheDocument();
    expect(screen.getByText('6 kg')).toBeInTheDocument();
    expect(screen.getByText('fire, flying')).toBeInTheDocument();
    expect(screen.getByText('blaze, solar-power')).toBeInTheDocument();
  });

  it('always shows Reset Search and Throw Error buttons and responds to clicks', async () => {
    render(
      <MemoryRouter>
        <BottomSection
          results={[]}
          onResetButton={onResetButton}
          onErrorButton={onErrorButton}
          setSearchParams={mockSetSearchParams}
          searchParams={mockSearchParams}
        />
      </MemoryRouter>
    );

    const resetBtn = screen.getByRole('button', { name: /reset search/i });

    expect(resetBtn).toBeEnabled();

    await userEvent.click(resetBtn);
    expect(onResetButton).toHaveBeenCalledTimes(1);
  });
});
