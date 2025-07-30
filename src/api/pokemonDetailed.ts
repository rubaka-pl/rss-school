import type {
  DetailedResult,
  PokemonData,
  SpeciesData,
} from '../types/pokemon';
import { normalizeFlavorText } from '../utilities/stringUtils';

export async function fetchDetailedPokemonData(
  name: string
): Promise<DetailedResult> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) throw new Error(`Failed to fetch ${name}: ${res.status}`);
  const data: PokemonData = await res.json();

  const speciesRes = await fetch(data.species.url);
  if (!speciesRes.ok) throw new Error(`Failed to fetch species for ${name}`);
  const speciesData: SpeciesData = await speciesRes.json();

  const flavor = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );

  return {
    name,
    description: flavor
      ? normalizeFlavorText(flavor.flavor_text)
      : 'No description',
    imageUrl: data.sprites.front_default ?? '',
    animatedImageUrl:
      data.sprites.versions?.['generation-v']?.['black-white']?.animated
        ?.front_default || null,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
    baseExperience: data.base_experience,
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    color: speciesData.color.name,
    habitat: speciesData.habitat?.name || null,
    isLegendary: speciesData.is_legendary,
    isMythical: speciesData.is_mythical,
  };
}
