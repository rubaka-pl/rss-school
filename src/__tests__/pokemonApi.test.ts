import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import type { Result } from '../types/app';
import {
  fetchPokemonList,
  fetchPage,
  fetchFullPokemonDataByName,
} from '../api/pokemonApi';
import { PAGE_SIZE } from '../utilities/constants';
import { normalizeFlavorText } from '../utilities/stringUtils';

vi.mock('../utilities/stringUtils', () => ({
  normalizeFlavorText: vi.fn((s: string) => s.trim()),
}));

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('fetchPokemonList returns array of names on success', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ name: 'a', url: 'u' }], count: 1 }),
    } as Response);

    const list = await fetchPokemonList();
    expect(list).toEqual(['a']);
  });

  it('fetchPokemonList throws on non-ok', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;
    fetchMock.mockResolvedValue({ ok: false, status: 404 } as Response);

    await expect(fetchPokemonList()).rejects.toThrow(
      'Failed to fetch pokemon list: 404'
    );
  });

  it('fetchPage returns correct data', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;

    const listResponse = {
      results: [{ name: 'p', url: 'url1' }],
      count: 10,
    };
    const pokemonData = {
      sprites: { front_default: 'img' },
      height: 1,
      weight: 2,
      types: [{ type: { name: 't' } }],
      abilities: [{ ability: { name: 'a' } }],
      species: { url: 'species_url' },
    };
    const speciesData = {
      flavor_text_entries: [{ flavor_text: 'desc', language: { name: 'en' } }],
    };

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => listResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => pokemonData,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => speciesData,
      } as Response);

    const { results, count } = await fetchPage(5);
    expect(count).toBe(10);
    expect(results).toEqual<Result[]>([
      {
        name: 'p',
        description: 'desc',
        imageUrl: 'img',
        height: 1,
        weight: 2,
        types: ['t'],
        abilities: ['a'],
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=5`
    );
  });

  it('fetchFullPokemonData throws if first fetch fails', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;
    fetchMock.mockResolvedValue({ ok: false, status: 500 } as Response);

    await expect(fetchFullPokemonDataByName('x')).rejects.toThrow(
      'Failed to fetch x: 500'
    );
  });

  it('fetchFullPokemonData handles species error', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;
    const baseData = {
      sprites: { front_default: '' },
      height: 1,
      weight: 2,
      types: [],
      abilities: [],
      species: { url: 'species' },
    };

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => baseData,
      } as Response)
      .mockResolvedValueOnce({ ok: false, status: 404 } as Response);

    await expect(fetchFullPokemonDataByName('x')).rejects.toThrow(
      'Failed to fetch species for x'
    );
  });

  it('fetchFullPokemonData returns normalized result', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;
    const pokeData = {
      sprites: { front_default: 'img' },
      height: 1,
      weight: 2,
      types: [{ type: { name: 't' } }],
      abilities: [{ ability: { name: 'a' } }],
      species: { url: 'species_url' },
    };
    const speciesData = {
      flavor_text_entries: [
        { flavor_text: ' raw \n text ', language: { name: 'en' } },
      ],
    };

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => pokeData,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => speciesData,
      } as Response);

    const result = await fetchFullPokemonDataByName('name');
    expect(normalizeFlavorText).toHaveBeenCalledWith(' raw \n text ');
    expect(result).toEqual({
      name: 'name',
      description: 'raw \n text'.trim(),
      imageUrl: 'img',
      height: 1,
      weight: 2,
      types: ['t'],
      abilities: ['a'],
    });
  });

  it('fetchFullPokemonDataByName throws on 404', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;
    fetchMock.mockResolvedValue({ ok: false, status: 404 } as Response);

    await expect(fetchFullPokemonDataByName('n')).rejects.toThrow(
      'Failed to fetch n: 404'
    );
  });

  it('fetchFullPokemonDataByName returns data', async () => {
    const fetchMock = fetch as MockedFunction<typeof fetch>;
    const pokeData = {
      sprites: { front_default: 'img2' },
      height: 3,
      weight: 4,
      types: [{ type: { name: 'x' } }],
      abilities: [{ ability: { name: 'b' } }],
      species: { url: 'sp' },
    };
    const speciesData = {
      flavor_text_entries: [{ flavor_text: 'foo', language: { name: 'en' } }],
    };

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => pokeData,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => speciesData,
      } as Response);

    const res = await fetchFullPokemonDataByName('n');
    expect(res).toEqual({
      name: 'n',
      description: 'foo',
      imageUrl: 'img2',
      height: 3,
      weight: 4,
      types: ['x'],
      abilities: ['b'],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `https://pokeapi.co/api/v2/pokemon/n`
    );
  });
});
