import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { PokemonListResponse, PokemonData, SpeciesData } from '../types/pokemon'
import type { Result } from '../types/app'
import { PAGE_SIZE } from '../utilities/constants'
import { normalizeFlavorText } from '../utilities/stringUtils'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getAllPokemonNames: builder.query<string[], void>({
      query: () => `pokemon?limit=100000`,
      transformResponse: (response: PokemonListResponse) =>
        response.results.map((r) => r.name),
    }),

    getPokemonPage: builder.query<{ results: Result[]; count: number }, number>({
      query: (offset) => `pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
      async transformResponse(response: PokemonListResponse): Promise<{ results: Result[]; count: number }> {
        const fullData = await Promise.all(
          response.results.map((p) => fetchFullPokemonData(p.name))
        )

        return {
          results: fullData,
          count: response.count,
        }
      },
    }),
  }),
})

async function fetchFullPokemonData(name: string): Promise<Result> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  if (!res.ok) throw new Error(`Failed to fetch ${name}: ${res.status}`)
  const data = (await res.json()) as PokemonData

  const speciesRes = await fetch(data.species.url)
  if (!speciesRes.ok) throw new Error(`Failed to fetch species for ${name}`)
  const speciesData = (await speciesRes.json()) as SpeciesData

  const flavor = speciesData.flavor_text_entries.find(
    (e) => e.language.name === 'en'
  )

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
  }
}

export const {
  useGetAllPokemonNamesQuery,
  useGetPokemonPageQuery,
} = pokemonApi
