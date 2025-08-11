import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TopSection from '../components/TopSection/TopSection';

vi.mock('../api/pokemonApi', () => ({
  useGetAllPokemonNamesQuery: vi.fn(() => ({
    data: ['pikachu', 'charmander'],
    isLoading: false,
    isError: false,
  })),
}));

vi.mock('../assets/logo.svg', () => ({ default: 'logo.svg' }));
vi.mock('../components/Loader/Loader', () => ({
  default: () => <div data-testid="loader" />,
}));

describe('TopSection — suggestions list behavior', () => {
  const onSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows and then clears the suggestions list when you type and clear', async () => {
    render(
      <TopSection
        onReset={vi.fn()}
        onError={vi.fn()}
        loading={false}
        onSearch={onSearch}
      />
    );
    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'pi');
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);

    await userEvent.clear(input);
    await waitFor(() => {
      expect(screen.queryByRole('list')).toBeNull();
    });
  });
});
