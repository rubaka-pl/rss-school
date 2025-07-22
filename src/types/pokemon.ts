export interface PokemonListResponse {
  count: number;
  results: Array<{ name: string; url: string }>;
}

export interface PokemonData {
  sprites: { front_default: string | null };
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  species: { url: string };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

export interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
}
