import { setupApiStore } from './test-utils';
import { pokemonApi } from '../api/pokemonApi';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { normalizeFlavorText } from '../utilities/stringUtils';

vi.mock('../utilities/stringUtils', () => ({
  normalizeFlavorText: vi.fn((s: string) => s.trim()),
}));

describe('pokemonApi.getPokemonDetails', () => {
  const storeRef = setupApiStore(pokemonApi);

  const createMockResponse = (data: unknown, status = 200): Response =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('throws if base data fetch fails', async () => {
    const fetchMock = fetch as ReturnType<typeof vi.fn>;

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));

    const result = await storeRef.store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('x')
    );

    expect(result.error).toBeDefined();
    expect(result.error).toMatchObject({
      status: 404,
      data: expect.stringContaining('Failed to fetch x'),
    });
  });

  it('throws if species fetch fails', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;

    const baseData = {
      sprites: { front_default: '' },
      height: 1,
      weight: 2,
      types: [],
      abilities: [],
      species: { url: 'https://pokeapi.co/api/v2/pokemon-species/x' },
    };

    fetchMock
      .mockResolvedValueOnce(createMockResponse(baseData))
      .mockResolvedValueOnce(new Response(null, { status: 404 }));

    const result = await storeRef.store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('x')
    );

    expect(result.error).toMatchObject({
      status: 404,
    });
  });

  it('returns normalized result with description', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;

    const pokeData = {
      sprites: {
        front_default: 'img',
        versions: {
          'generation-v': {
            'black-white': {
              animated: {
                front_default: null,
              },
            },
          },
        },
      },
      height: 1,
      weight: 2,
      types: [{ type: { name: 't' } }],
      abilities: [{ ability: { name: 'a' } }],
      base_experience: 100,
      stats: [{ stat: { name: 'hp' }, base_stat: 50 }],
      species: { url: 'https://pokeapi.co/api/v2/pokemon-species/x' },
    };

    const speciesData = {
      flavor_text_entries: [
        { flavor_text: ' raw \n text ', language: { name: 'en' } },
      ],
      color: { name: 'red' },
      habitat: { name: 'mountain' },
      is_legendary: true,
      is_mythical: false,
    };

    fetchMock
      .mockResolvedValueOnce(createMockResponse(pokeData))
      .mockResolvedValueOnce(createMockResponse(speciesData));

    const result = await storeRef.store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('x')
    );

    expect(normalizeFlavorText).toHaveBeenCalledWith(' raw \n text ');

    expect(result.data).toEqual({
      name: 'x',
      description: 'raw \n text',
      imageUrl: 'img',
      animatedImageUrl: null,
      height: 1,
      weight: 2,
      types: ['t'],
      abilities: ['a'],
      baseExperience: 100,
      stats: [{ name: 'hp', value: 50 }],
      color: 'red',
      habitat: 'mountain',
      isLegendary: true,
      isMythical: false,
    });
  });
});
