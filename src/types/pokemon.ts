export interface PokemonListResponse {
  count: number;
  results: Array<{ name: string; url: string }>;
}

export interface PokemonData {
  sprites: {
    front_default: string | null;
    versions?: {
      ['generation-v']?: {
        ['black-white']?: {
          animated?: {
            front_default: string | null;
          };
        };
      };
    };
  };
  height: number;
  weight: number;
  base_experience: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
  species: { url: string };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

export interface SpeciesData {
  color: { name: string };
  habitat: { name: string } | null;
  is_legendary: boolean;
  is_mythical: boolean;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

export interface DetailedResult {
  name: string;
  description: string;
  imageUrl: string;
  animatedImageUrl: string | null;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  baseExperience: number;
  stats: { name: string; value: number }[];
  color: string;
  habitat: string | null;
  isLegendary: boolean;
  isMythical: boolean;
  detailsUrl?: string;
}
