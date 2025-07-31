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
import { useState } from 'react';
import { PAGE_SIZE } from '../../utilities/constants';

const HomePage = () => {
  const isValid = useValidateParams(['page', 'details', 'search']);

  const { detailsData, clearDetails } = usePokemonDetails();

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
  } = usePokemonSearch(clearDetails);

  const [showBuggyComponent, setShowBuggyComponent] = useState(false);

  if (!isValid) return <NotFoundPage />;

  const handleError = () => setShowBuggyComponent(true);

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
                onResetButton={handleReset}
                onErrorButton={handleError}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
              {detailsData && (
                <DetailsData data={detailsData} onClose={clearDetails} />
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
