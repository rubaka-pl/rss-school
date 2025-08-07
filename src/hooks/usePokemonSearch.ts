import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetPokemonPageQuery, useGetAllPokemonNamesQuery } from '../api/pokemonApi';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm, clearSearchTerm] = useLocalStorage<string>(
    'searchTerm',
    ''
  );
  const [searchLoading, setSearchLoading] = useState(false);

  const page = getValidPageFromParams(searchParams);
  const offset = getOffsetFromPage(page, PAGE_SIZE);
  const totalPages = getTotalPages(count, PAGE_SIZE);

  const {
    data: pageData,
    error: pageError,
    isLoading: pageLoading,
    refetch: refetchPage,
  } = useGetPokemonPageQuery(offset, {
    skip: !!searchTerm,
  });

  const {
    data: allNames = [],
    error: namesError,
    isLoading: namesLoading,
  } = useGetAllPokemonNamesQuery();

  useEffect(() => {
    if (pageData) {
      setResults(pageData.results);
      setCount(pageData.count);
    }
  }, [pageData]);

  useEffect(() => {
    if (pageError || namesError) {
      setErrorMessage('Error loading Pokédex data');
    } else {
      setErrorMessage(null);
    }
  }, [pageError, namesError]);

  const handleSearch = async (term: string) => {
    clearDetails();
    const query = normalizeSearchTerm(term);
    setSearchTerm(query);
    setErrorMessage(null);

    if (!query) {
      setResults([]);
      setCount(0);
      setSearchParams({ page: '1' });
      refetchPage();
      return;
    }

    if (!allNames.length) {
      setErrorMessage('Pokémon list is not loaded yet');
      return;
    }

    const filteredNames = allNames.filter((name) => name.includes(query));

    if (filteredNames.length === 0) {
      setResults([]);
      setCount(0);
      setErrorMessage('Pokémon not found');
      return;
    }

    setResults([]);
    setCount(filteredNames.length);
    setSearchLoading(true);

    try {
      const fullData = await Promise.all(
        filteredNames.map((name) => fetchDetailedPokemonData(name))
      );
      setResults(fullData);
    } catch (error) {
      const msg = isError(error)
        ? 'Error loading Pokémon data'
        : 'Unknown error occurred';
      setErrorMessage(msg);
      setResults([]);
      setCount(0);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReset = () => {
    clearSearchTerm();
    clearDetails();
    setSearchParams({ page: '1' });
    setErrorMessage(null);
    refetchPage();
  };

  const loading = pageLoading || namesLoading || searchLoading;

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
