import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import DetailsData from '../components/DetailsData/DetailsData';
import { vi } from 'vitest';

interface Stat {
  name: string;
  value: number;
}

interface DataShape {
  name: string;
  animatedImageUrl: string;
  imageUrl: string;
  description: string;
  baseExperience: number;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  color: string;
  habitat: string | null;
  isLegendary: boolean;
  isMythical: boolean;
  stats: Stat[];
}

describe('DetailsData component', () => {
  const mockOnClose = vi.fn();

  const baseData: DataShape = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all fields with animated GIF when animatedImageUrl is provided', () => {
    render(<DetailsData data={baseData} onClose={mockOnClose} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Pikachu'
    );
    expect(screen.getByText(/Electric type Pokémon/i)).toBeInTheDocument();

    const animatedImg = screen.getByAltText(
      'Pikachu animated'
    ) as HTMLImageElement;
    expect(animatedImg).toHaveAttribute('src', baseData.animatedImageUrl);

    const items = screen.getAllByRole('listitem');

    const getItemText = (label: string) =>
      items.find((li) => within(li).queryByText(new RegExp(label, 'i')))
        ?.textContent ?? '';

    expect(getItemText('Base Experience')).toContain('112');
    expect(getItemText('Height')).toContain('4');
    expect(getItemText('Weight')).toContain('60');
    expect(getItemText('Types')).toContain('Electric');
    expect(getItemText('Abilities')).toContain('Static, Lightning Rod');
    expect(getItemText('Color')).toContain('Yellow');
    expect(getItemText('Habitat')).toContain('Forest');
    expect(getItemText('Legendary')).toContain('No');
    expect(getItemText('Mythical')).toContain('No');

    expect(screen.getByText('hp: 35')).toBeInTheDocument();
    expect(screen.getByText('attack: 55')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /✖/ }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('falls back to static image and "Unknown" habitat when animatedImageUrl or habitat absent', () => {
    const minimalData: DataShape = {
      ...baseData,
      animatedImageUrl: '',
      habitat: null,
    };

    render(<DetailsData data={minimalData} onClose={mockOnClose} />);

    const fallbackImg = screen.getByAltText('Pikachu') as HTMLImageElement;
    expect(fallbackImg).toHaveAttribute('src', baseData.imageUrl);

    const items = screen.getAllByRole('listitem');
    const habitatItem = items.find((li) => within(li).queryByText(/Habitat:/));
    expect(habitatItem).toHaveTextContent('Habitat: Unknown');
  });
});
