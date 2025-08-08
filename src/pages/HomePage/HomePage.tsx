import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import TopSection from '../../components/TopSection/TopSection';
import BottomSection from '../../components/BottomSection/BottomSection';
import Pagination from '../../components/Pagination/Pagination';
import DetailsData from '../../components/DetailsData/DetailsData';
import BuggyBottom from '../../components/BuggyBottom/BuggyBottom';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

import { usePokemonSearch } from '../../hooks/usePokemonSearch';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import { useValidateParams } from '../../hooks/useValidateParams';
import { PAGE_SIZE } from '../../utilities/constants';
import {
  useGetPokemonDetailsQuery,
  useGetPokemonPageQuery,
  pokemonApi,
} from '../../api/pokemonApi';

const HomePage = () => {
  const isValid = useValidateParams(['page', 'details', 'search']);
  const dispatch = useDispatch();

  const {
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
  } = usePokemonSearch();

  const { refetch: refetchPokemon } = useGetPokemonDetailsQuery(
    searchParams.get('details') || '',
    { skip: !searchParams.get('details') }
  );

  const { refetch: refetchSearch } = useGetPokemonPageQuery(
    Number(searchParams.get('page')) || 0
  );

  const { detailsData, clearDetails } = usePokemonDetails();

  const handleClearDetails = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('details');
    setSearchParams(newParams);
    clearDetails();
  };

  const [showBuggyComponent, setShowBuggyComponent] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    console.log('[Refresh] Started. Params:', searchParams.toString());
    setIsRefreshing(true);
    try {
      dispatch(pokemonApi.util.invalidateTags(['Pokemon']));
      if (searchParams.get('details')) {
        await refetchPokemon();
        console.log('[Refresh] Refetched details');
      }
      await refetchSearch();
      console.log('[Refresh] Refetched list');
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
      console.log('[Refresh] Done');
    }
  };

  const handleError = () => setShowBuggyComponent(true);

  useEffect(() => {
    if (!searchParams.get('details') && detailsData !== null) {
      clearDetails();
    }
  }, [searchParams.toString(), detailsData]);

  if (!isValid) return <NotFoundPage />;

  return (
    <ErrorBoundary>
      <ThemeToggle />
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
                onErrorButton={handleError}
                onResetButton={handleReset}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />

              {searchParams.get('details') && detailsData && (
                <DetailsData data={detailsData} onClose={handleClearDetails} />
              )}

              {!searchTerm && totalPages > 1 && (
                <Pagination
                  offset={offset}
                  total={count}
                  pageSize={PAGE_SIZE}
                  onPageChange={(offset) => {
                    const newPage = Math.floor(offset / PAGE_SIZE) + 1;
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.set('page', newPage.toString());
                      return newParams;
                    });
                  }}
                />
              )}
            </>
          )}
        </ErrorBoundary>
      )}
    </ErrorBoundary>
  );
};

export default HomePage;
