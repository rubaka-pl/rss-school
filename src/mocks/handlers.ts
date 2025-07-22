import { http, HttpResponse } from 'msw';
import { PAGE_SIZE } from '../utilities/constants';
import type {
  PokemonListResponse,
  PokemonData,
  SpeciesData,
} from '../types/pokemon';

export const handlers = [
  http.get<never, never, PokemonListResponse>(
    'https://pokeapi.co/api/v2/pokemon',
    ({ request }) => {
      const url = new URL(request.url);
      const limit = url.searchParams.get('limit') || '';
      const offset = url.searchParams.get('offset') || '';

      if (limit === `${PAGE_SIZE}` && offset === '5') {
        return HttpResponse.json(
          {
            count: 10,
            results: [
              { name: 'p', url: 'https://pokeapi.co/api/v2/pokemon/p' },
            ],
          },
          { status: 200 }
        );
      }

      return HttpResponse.json(
        {
          count: 1,
          results: [{ name: 'a', url: 'https://pokeapi.co/api/v2/pokemon/a' }],
        },
        { status: 200 }
      );
    }
  ),

  http.get<{ name: string }, never, PokemonData>(
    'https://pokeapi.co/api/v2/pokemon/:name',
    ({ params }) => {
      const { name } = params;
      return HttpResponse.json(
        {
          sprites: { front_default: `${name}-img` },
          height: 10,
          weight: 20,
          types: [{ type: { name: 't' } }],
          abilities: [{ ability: { name: 'a' } }],
          species: { url: `https://pokeapi.co/api/v2/pokemon-species/${name}` },
        },
        { status: 200 }
      );
    }
  ),

  http.get<{ name: string }, never, SpeciesData>(
    'https://pokeapi.co/api/v2/pokemon-species/:name',
    ({ params }) => {
      const { name } = params;
      return HttpResponse.json(
        {
          flavor_text_entries: [
            {
              flavor_text: ` raw \n ${name} text `,
              language: { name: 'en' },
            },
          ],
        },
        { status: 200 }
      );
    }
  ),
];
