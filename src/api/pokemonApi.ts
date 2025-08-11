import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PokemonListResponse,
  PokemonData,
  SpeciesData,
  DetailedResult,
} from '../types/pokemon';
import { PAGE_SIZE } from '../utilities/constants';
import { normalizeFlavorText } from '../utilities/stringUtils';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    getAllPokemonNames: builder.query<string[], undefined>({
      query: () => 'pokemon?limit=100000',
      transformResponse: (response: PokemonListResponse) =>
        response.results.map((r) => r.name),
    }),

    getPokemonPage: builder.query<
      { results: DetailedResult[]; count: number },
      number
    >({
      async queryFn(offset) {
        try {
          const listRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
          );

          if (!listRes.ok) {
            return {
              error: {
                status: listRes.status,
                data: `Failed to fetch list: ${listRes.statusText}`,
              },
            };
          }

          const listData: PokemonListResponse = await listRes.json();

          const detailedResults = (
            await Promise.all(
              listData.results.map(async (pokemon) => {
                try {
                  const pokemonRes = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
                  );
                  if (!pokemonRes.ok) {
                    console.error(`Failed to fetch ${pokemon.name}`);
                    return null;
                  }
                  const data: PokemonData = await pokemonRes.json();

                  const speciesRes = await fetch(data.species.url);
                  if (!speciesRes.ok) {
                    console.error(
                      `Failed to fetch species for ${pokemon.name}`
                    );
                    return null;
                  }
                  const speciesData: SpeciesData = await speciesRes.json();

                  const flavor = speciesData.flavor_text_entries.find(
                    (entry) => entry.language.name === 'en'
                  );

                  return {
                    name: pokemon.name,
                    description: flavor
                      ? normalizeFlavorText(flavor.flavor_text)
                      : 'No description',
                    imageUrl: data.sprites.front_default ?? '',
                    animatedImageUrl:
                      data.sprites.versions?.['generation-v']?.['black-white']
                        ?.animated?.front_default ?? null,
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
                    habitat: speciesData.habitat?.name ?? null,
                    isLegendary: speciesData.is_legendary,
                    isMythical: speciesData.is_mythical,
                  } as DetailedResult;
                } catch (err) {
                  console.error(`Unexpected error for ${pokemon.name}`, err);
                  return null;
                }
              })
            )
          ).filter((p): p is DetailedResult => p !== null);

          return {
            data: {
              results: detailedResults,
              count: listData.count,
            },
          };
        } catch (err) {
          return {
            error: {
              status: 500,
              data: err instanceof Error ? err.message : 'Unknown error',
            },
          };
        }
      },
    }),

    getPokemonDetails: builder.query<DetailedResult, string>({
      async queryFn(name) {
        try {
          const pokemonRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${name}`
          );
          if (!pokemonRes.ok) {
            return {
              error: {
                status: pokemonRes.status,
                data: `Failed to fetch ${name}: ${pokemonRes.statusText}`,
              },
            };
          }
          const data: PokemonData = await pokemonRes.json();

          const speciesRes = await fetch(data.species.url);
          if (!speciesRes.ok) {
            return {
              error: {
                status: speciesRes.status,
                data: `Failed to fetch species for ${name}: ${speciesRes.statusText}`,
              },
            };
          }
          const speciesData: SpeciesData = await speciesRes.json();

          const flavor = speciesData.flavor_text_entries.find(
            (entry) => entry.language.name === 'en'
          );

          const detailed: DetailedResult = {
            name,
            description: flavor
              ? normalizeFlavorText(flavor.flavor_text)
              : 'No description',
            imageUrl: data.sprites.front_default ?? '',
            animatedImageUrl:
              data.sprites.versions?.['generation-v']?.['black-white']?.animated
                ?.front_default ?? null,
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
            habitat: speciesData.habitat?.name ?? null,
            isLegendary: speciesData.is_legendary,
            isMythical: speciesData.is_mythical,
          };

          return { data: detailed };
        } catch (err) {
          return {
            error: {
              status: 500,
              data: err instanceof Error ? err.message : 'Unknown error',
            },
          };
        }
      },
      providesTags: (_result, _error, name) => [{ type: 'Pokemon', id: name }],
    }),
  }),
});

export const {
  useGetPokemonPageQuery,
  useGetAllPokemonNamesQuery,
  useGetPokemonDetailsQuery,
} = pokemonApi;
