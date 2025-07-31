import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPage, fetchPokemonList } from '../api/pokemonApi';
import { fetchDetailedPokemonData } from '../api/pokemonDetailed';
import { normalizeSearchTerm } from '../utilities/stringUtils';
import { isError } from '../utilities/typeGuards';
import { PAGE_SIZE } from '../utilities/constants';
import {
  getValidPageFromParams,
  getOffsetFromPage,
  getTotalPages,
} from '../utilities/paginationUtils';
import type { Result } from '../types/app';
import { useLocalStorage } from './useLocalStorage';

export const usePokemonSearch = (clearDetails: () => void) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Result[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm, clearSearchTerm] = useLocalStorage<string>(
    'searchTerm',
    ''
  );

  const page = getValidPageFromParams(searchParams);
  const offset = getOffsetFromPage(page, PAGE_SIZE);
  const totalPages = getTotalPages(count, PAGE_SIZE);

  useEffect(() => {
    const init = async () => {
      try {
        const names = await fetchPokemonList();
        setPokemonNames(names);
        if (searchTerm) {
          await handleSearch(searchTerm);
        } else {
          await loadPageByPageNumber(page);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to initialize Pokédex');
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      loadPageByPageNumber(page);
    }
  }, [searchParams]);

  const handleSearch = async (term: string) => {
    const query = normalizeSearchTerm(term);
    setLoading(true);
    setErrorMessage(null);
    setSearchTerm(query);
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete('search');
        params.delete('details');
        params.set('page', '1');
        return params;
      },
      { replace: true }
    );
    if (!query) {
      await loadPage(0);
      return;
    }

    const filteredNames = pokemonNames.filter((name) => name.includes(query));

    try {
      const fullData = await Promise.all(
        filteredNames.map((name) => fetchDetailedPokemonData(name))
      );
      setResults(fullData);
      setCount(filteredNames.length);
    } catch (error) {
      const msg = isError(error)
        ? 'Failed to load some Pokémon'
        : 'Unknown error occurred';
      setErrorMessage(msg);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (offset: number) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { results, count } = await fetchPage(offset);
      const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
      setResults(results);
      setCount(count);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', String(currentPage));
        return newParams;
      });
    } catch (error) {
      setErrorMessage(
        isError(error) ? error.message : 'Unknown error occurred'
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPageByPageNumber = async (pageNumber: number) => {
    const newOffset = (pageNumber - 1) * PAGE_SIZE;
    await loadPage(newOffset);
  };

  const handleReset = () => {
    clearSearchTerm();
    clearDetails();
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete('search');
        params.set('page', '1');
        return params;
      },
      { replace: true }
    );
    loadPage(0);
  };

  return {
    searchTerm,
    handleSearch,
    handleReset,
    loading,
    errorMessage,
    results,
    count,
    offset,
    totalPages,
    setSearchParams,
    searchParams,
  };
};
