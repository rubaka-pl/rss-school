import type { Result } from '../types/app';
import { PAGE_SIZE } from '../utilities/constants';
import { normalizeFlavorText } from '../utilities/stringUtils';

interface PokemonListResponse {
  count: number;
  results: Array<{ name: string; url: string }>;
}

interface PokemonData {
  sprites: { front_default: string | null };
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  species: { url: string };
}

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
}

export async function fetchPokemonList(): Promise<string[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon list: ${res.status}`);
  const json = (await res.json()) as PokemonListResponse;
  return json.results.map((r) => r.name);
}

export async function fetchPage(
  offset: number
): Promise<{ results: Result[]; count: number }> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
  );
  if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);

  const json = (await res.json()) as PokemonListResponse;
  const fullData = await Promise.all(
    json.results.map((p) => fetchFullPokemonData(p.name, p.url))
  );

  return {
    results: fullData,
    count: json.count,
  };
}

export async function fetchFullPokemonData(
  name: string,
  url: string
): Promise<Result> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${name}: ${res.status}`);
  const data = (await res.json()) as PokemonData;

  const speciesRes = await fetch(data.species.url);
  if (!speciesRes.ok) throw new Error(`Failed to fetch species for ${name}`);
  const speciesData = (await speciesRes.json()) as SpeciesData;

  const flavor = speciesData.flavor_text_entries.find(
    (e) => e.language.name === 'en'
  );

  return {
    name,
    description: flavor
      ? normalizeFlavorText(flavor.flavor_text)
      : 'No description',
    imageUrl: data.sprites.front_default ?? '',
    height: data.height,
    weight: data.weight,
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
  };
}

export async function fetchFullPokemonDataByName(
  name: string
): Promise<Result> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) throw new Error(`Failed to fetch ${name}: ${res.status}`);
  const data = (await res.json()) as PokemonData;

  const speciesRes = await fetch(data.species.url);
  if (!speciesRes.ok) throw new Error(`Failed to fetch species for ${name}`);
  const speciesData = (await speciesRes.json()) as SpeciesData;

  const flavor = speciesData.flavor_text_entries.find(
    (e) => e.language.name === 'en'
  );

  return {
    name,
    description: flavor
      ? normalizeFlavorText(flavor.flavor_text)
      : 'No description',
    imageUrl: data.sprites.front_default ?? '',
    height: data.height,
    weight: data.weight,
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
  };
}
