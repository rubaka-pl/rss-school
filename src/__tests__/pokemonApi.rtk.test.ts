import { setupApiStore } from './test-utils';
import { pokemonApi } from '../api/pokemonApi';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('pokemonApi RTK Query', () => {
  const storeRef = setupApiStore(pokemonApi);

  const createMockResponse = (data: unknown): Response =>
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getAllPokemonNames returns names', async () => {
    const fetchMock = fetch as ReturnType<typeof vi.fn>;

    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        count: 2,
        results: [
          { name: 'pikachu', url: 'url1' },
          { name: 'bulbasaur', url: 'url2' },
        ],
      })
    );

    const result = await storeRef.store.dispatch(
      pokemonApi.endpoints.getAllPokemonNames.initiate(undefined)
    );

    expect(result.data).toEqual(['pikachu', 'bulbasaur']);
  });

  it('getPokemonPage returns normalized result', async () => {
    const fetchMock = fetch as ReturnType<typeof vi.fn>;

    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        count: 1,
        results: [
          {
            name: 'pikachu',
            url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
          },
        ],
      })
    );

    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        name: 'pikachu',
        sprites: { front_default: 'img' },
        height: 1,
        weight: 2,
        types: [{ type: { name: 'electric' } }],
        abilities: [{ ability: { name: 'static' } }],
        base_experience: 112,
        stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
        species: { url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
      })
    );

    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        flavor_text_entries: [
          {
            flavor_text: 'A cute mouse.',
            language: { name: 'en' },
          },
        ],
        color: { name: 'yellow' },
        habitat: { name: 'forest' },
        is_legendary: false,
        is_mythical: false,
      })
    );

    const result = await storeRef.store.dispatch(
      pokemonApi.endpoints.getPokemonPage.initiate(0)
    );

    expect(result.data?.count).toBe(1);
    expect(result.data?.results).toHaveLength(1);

    expect(result.data?.results[0]).toMatchObject({
      name: 'pikachu',
      description: 'A cute mouse.',
      imageUrl: 'img',
      height: 1,
      weight: 2,
      types: ['electric'],
      abilities: ['static'],
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('getPokemonDetails returns enriched result', async () => {
    const fetchMock = fetch as ReturnType<typeof vi.fn>;

    const pokemonData = {
      sprites: {
        front_default: 'img',
        versions: {
          'generation-v': {
            'black-white': {
              animated: {
                front_default: 'anim_img',
              },
            },
          },
        },
      },
      height: 1,
      weight: 2,
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }],
      base_experience: 64,
      stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
      species: { url: 'species_url' },
    };

    const speciesData = {
      flavor_text_entries: [
        { flavor_text: 'Electric mouse.', language: { name: 'en' } },
      ],
      color: { name: 'yellow' },
      habitat: { name: 'forest' },
      is_legendary: false,
      is_mythical: false,
    };

    fetchMock
      .mockResolvedValueOnce(createMockResponse(pokemonData))
      .mockResolvedValueOnce(createMockResponse(speciesData));

    const result = await storeRef.store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('pikachu')
    );

    expect(result.data).toMatchObject({
      name: 'pikachu',
      description: 'Electric mouse.',
      animatedImageUrl: 'anim_img',
      color: 'yellow',
      habitat: 'forest',
      isLegendary: false,
      isMythical: false,
    });
  });

  it('getPokemonDetails returns error when base fetch fails', async () => {
    const fetchMock = fetch as ReturnType<typeof vi.fn>;

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));

    const result = await storeRef.store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('unknown')
    );

    expect(result.error).toBeDefined();
    expect(result.error).toMatchObject({
      status: 500,
      data: expect.stringContaining('Failed to fetch unknown'),
    });
  });
});
