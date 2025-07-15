import React from 'react';
import TopSection from './components/TopSection/TopSection';
import BottomSection from './components/BottomSection/BottomSection';
import type { AppState } from './types/app';
import {
  fetchPage,
  fetchPokemonList,
  fetchFullPokemonDataByName,
} from './api/pokemonApi';
import { isError } from './utilities/typeGuards';
import GlowCursor from './components/Cursor/Cursor';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import BuggyBottom from './components/BuggyBottom/BuggyBottom';
import { PAGE_SIZE } from './utilities/constants';
import Pagination from './components/Pagination/Pagination';
import { normalizeSearchTerm } from './utilities/stringUtils';
export default class App extends React.Component<object, AppState> {
  state: AppState = {
    results: [],
    loading: false,
    errorMessage: null,
    offset: 0,
    count: 0,
    searchTerm: localStorage.getItem('searchTerm') || '',
    showBuggyComponent: false,
    pokemonNames: [],
  };

  async componentDidMount() {
    try {
      const pokemonNames = await fetchPokemonList();
      this.setState({ pokemonNames });
    } catch (error) {
      console.error('Failed to load pokemon list:', error);
      this.setState({ errorMessage: 'Failed to load pokemon list' });
    }

    if (this.state.searchTerm) {
      this.handleSearch(this.state.searchTerm);
    } else {
      this.loadPage(0);
    }
  }

  handleSearch = async (term: string) => {
    const query = normalizeSearchTerm(term);
    this.setState({ loading: true, errorMessage: null, searchTerm: query });
    localStorage.setItem('searchTerm', query);

    if (!query) {
      return this.loadPage(0);
    }

    const filteredNames = this.state.pokemonNames.filter((name) =>
      name.includes(query)
    );

    try {
      const fullData = await Promise.all(
        filteredNames.map((name) => fetchFullPokemonDataByName(name))
      );
      this.setState({
        results: fullData,
        count: filteredNames.length,
        offset: 0,
      });
    } catch (error) {
      console.error('Search failed:', error);
      const msg = isError(error)
        ? `Failed to load some Pokémon`
        : 'Unknown error occurred';
      this.setState({
        errorMessage: msg,
        results: [],
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  loadPage = async (offset: number) => {
    this.setState({ loading: true, errorMessage: null });

    try {
      const { results, count } = await fetchPage(offset);
      this.setState({ results, count, offset });
    } catch (error) {
      this.setState({
        errorMessage: isError(error) ? error.message : 'Unknown error occurred',
        results: [],
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleReset = () => {
    this.setState({ searchTerm: '' });
    localStorage.removeItem('searchTerm');
    this.loadPage(0);
  };

  handleError = () => {
    this.setState({ showBuggyComponent: true });
  };

  render() {
    const {
      results,
      loading,
      errorMessage,
      offset,
      count,
      searchTerm,
      showBuggyComponent,
    } = this.state;

    const totalPages = Math.ceil(count / PAGE_SIZE);

    return (
      <>
        <ErrorBoundary>
          <GlowCursor />
          <TopSection loading={loading} onSearch={this.handleSearch} />

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
                    onResetButton={this.handleReset}
                    onErrorButton={this.handleError}
                  />

                  {!searchTerm && totalPages > 1 && (
                    <Pagination
                      offset={offset}
                      total={count}
                      pageSize={PAGE_SIZE}
                      onPageChange={this.loadPage}
                    />
                  )}
                </>
              )}
            </ErrorBoundary>
          )}
        </ErrorBoundary>
      </>
    );
  }
}
