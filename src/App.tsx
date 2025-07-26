import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import TopSection from './components/TopSection/TopSection';
import BottomSection from './components/BottomSection/BottomSection';
import GlowCursor from './components/Cursor/Cursor';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import BuggyBottom from './components/BuggyBottom/BuggyBottom';
import Pagination from './components/Pagination/Pagination';

import {
  fetchPage,
  fetchPokemonList,
  fetchFullPokemonDataByName,
} from './api/pokemonApi';
import { normalizeSearchTerm } from './utilities/stringUtils';
import { isError } from './utilities/typeGuards';
import { PAGE_SIZE } from './utilities/constants';
import type { Result } from './types/app';
import DetailsData from './components/DetailsData/DetailsData';

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem('searchTerm') || ''
  );
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);
  const page = Number(searchParams.get('page')) || 1;
  const offset = (page - 1) * PAGE_SIZE;
  const detailsName = searchParams.get('details');
  const [detailsData, setDetailsData] = useState<Result | null>(null);

  useEffect(() => {
    if (detailsName) {
      fetchFullPokemonDataByName(detailsName).then(setDetailsData);
    } else {
      setDetailsData(null);
    }
  }, [detailsName]);

  useEffect(() => {
    const init = async () => {
      try {
        const names = await fetchPokemonList();
        setPokemonNames(names);

        const storedTerm = localStorage.getItem('searchTerm') || '';
        setSearchTerm(storedTerm);

        if (storedTerm) {
          await handleSearch(storedTerm);
        } else {
          await loadPage(offset);
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
    localStorage.setItem('searchTerm', query);
    setSearchParams({});

    if (!query) {
      await loadPage(0);
      return;
    }

    const filteredNames = pokemonNames.filter((name) => name.includes(query));

    try {
      const fullData = await Promise.all(
        filteredNames.map((name) => fetchFullPokemonDataByName(name))
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
      setResults(results);
      setCount(count);
      setSearchParams({ page: String(Math.floor(offset / PAGE_SIZE) + 1) });
    } catch (error) {
      setErrorMessage(
        isError(error) ? error.message : 'Unknown error occurred'
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    localStorage.removeItem('searchTerm');
    setSearchParams({ page: '1' });
    loadPage(0);
  };

  const handleError = () => {
    setShowBuggyComponent(true);
  };

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <ErrorBoundary>
      <GlowCursor />
      <TopSection loading={loading} onSearch={handleSearch} />

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
