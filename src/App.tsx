import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getValidPageFromParams,
  getOffsetFromPage,
  getTotalPages,
} from './utilities/paginationUtils';
import TopSection from './components/TopSection/TopSection';
import BottomSection from './components/BottomSection/BottomSection';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import BuggyBottom from './components/BuggyBottom/BuggyBottom';
import Pagination from './components/Pagination/Pagination';

import { fetchPage, fetchPokemonList } from './api/pokemonApi';
import { fetchDetailedPokemonData } from './api/pokemonDetailed';
import { normalizeSearchTerm } from './utilities/stringUtils';
import { isError } from './utilities/typeGuards';
import { PAGE_SIZE } from './utilities/constants';
import type { Result } from './types/app';
import DetailsData from './components/DetailsData/DetailsData';
import type { DetailedResult } from './types/pokemon';

import { useLocalStorage } from './hooks/useLocalStorage';

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm, clearSearchTerm] = useLocalStorage<string>(
    'searchTerm',
    ''
  );
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);
  const detailsName = searchParams.get('details');
  const [detailsData, setDetailsData] = useState<DetailedResult | null>(null);

  const page = getValidPageFromParams(searchParams);
  const offset = getOffsetFromPage(page, PAGE_SIZE);
  const totalPages = getTotalPages(count, PAGE_SIZE);
  useEffect(() => {
    if (detailsName) {
      fetchDetailedPokemonData(detailsName).then(setDetailsData);
    } else {
      setDetailsData(null);
    }
  }, [detailsName]);

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
        console.error('Failed to initialize:', error);
        setErrorMessage('Failed to initialize Pokédex');
      }
    };

    init();
  }, []);

  const handleSearch = async (term: string) => {
    const query = normalizeSearchTerm(term);
    setLoading(true);
    setErrorMessage(null);
    setSearchTerm(query);
    setSearchParams({});

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
      console.error('Search failed:', error);
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
      const totalPages = getTotalPages(count, PAGE_SIZE);

      setResults(results);
      setCount(count);

      setSearchParams({
        page: String(Math.min(currentPage, totalPages)),
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
    setSearchParams({ page: '1' });
    loadPage(0);
  };

  const handleError = () => {
    setShowBuggyComponent(true);
  };

  return (
    <ErrorBoundary>
      <TopSection
        onReset={handleReset}
        loading={loading}
        onSearch={handleSearch}
        onError={handleError}
      />

      {loading ? (
        <p>Loading…</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <ErrorBoundary>
          {showBuggyComponent ? (
            <BuggyBottom />
          ) : (
            <>
              <BottomSection
                results={results}
                onResetButton={handleReset}
                onErrorButton={handleError}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
              {detailsData && (
                <DetailsData
                  data={detailsData}
                  onClose={() => {
                    searchParams.delete('details');
                    setSearchParams(searchParams);
                  }}
                />
              )}
              {!searchTerm && totalPages > 1 && (
                <Pagination
                  offset={offset}
                  total={count}
                  pageSize={PAGE_SIZE}
                  onPageChange={loadPage}
                />
              )}
            </>
          )}
        </ErrorBoundary>
      )}
    </ErrorBoundary>
  );
};

export default App;
