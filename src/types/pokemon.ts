export interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

export interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
}
