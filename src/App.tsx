import React from 'react';
import { TopSection } from './components/TopSection';
import { BottomSection } from './components/BottomSection';
import { ErrorBoundary } from './components/ErrorBoundary'; // Ваша ErrorBoundary
import { BuggyComponent } from './components/BuggyComponent'; // Ваш BuggyComponent
import './App.css';
// =============================================================
// I.
// =============================================================
function isError(error: unknown): error is Error {
  return error instanceof Error && typeof (error as Error).message === 'string';
}
const PAGE_SIZE = 8;

// =============================================================
// II.
// =============================================================
interface AppState {
  results: Result[];
  loading: boolean;
  errorMessage: string | null;
  offset: number;
  count: number;
  searchTerm: string;
  showBuggyComponent: boolean;
}

interface Result {
  name: string;
  description: string;
  imageUrl: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
}

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
}

// =============================================================
// III.
// =============================================================

export default class App extends React.Component<object, AppState> {
  state: AppState = {
    results: [],
    loading: false,
    errorMessage: null,
    offset: 0,
    count: 0,
    searchTerm: localStorage.getItem('searchTerm') || '',
    showBuggyComponent: false,
  };

  private fetchFullData = async (
    name: string,
    url: string
  ): Promise<Result> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${name}`);
    const data = await res.json();

    const speciesRes = await fetch(data.species.url);
    const speciesData = (await speciesRes.json()) as SpeciesData;
    const flavor = speciesData.flavor_text_entries.find(
      (e) => e.language.name === 'en'
    );
    const description = flavor
      ? flavor.flavor_text.replace(/\n|\f/g, ' ')
      : 'No description';

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Задержка 1.5 секунды

    return {
      name,
      description,
      imageUrl: (data.sprites.front_default as string) || '',
      height: data.height as number,
      weight: data.weight as number,
      types: (data.types as { type: { name: string } }[]).map(
        (t) => t.type.name
      ),
      abilities: (data.abilities as { ability: { name: string } }[]).map(
        (a) => a.ability.name
      ),
    };
  };

  private fetchPage = async (offset: number) => {
    this.setState({ loading: true, errorMessage: null });
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
      );
      if (!res.ok) throw new Error(`Page fetch failed: ${res.status}`);
      const json = (await res.json()) as {
        count: number;
        results: { name: string; url: string }[];
      };
      const fullData = await Promise.all(
        json.results.map((p) => this.fetchFullData(p.name, p.url))
      );
      this.setState({ results: fullData, offset, count: json.count });
    } catch (e) {
      console.error(e);
      let errorMessage = 'Unknown error occurred during page fetch.';
      if (isError(e)) {
        errorMessage = e.message;
      }
      this.setState({ errorMessage: errorMessage });
    } finally {
      this.setState({ loading: false });
    }
  };

  private handleSearch = async (term: string) => {
    const query = term.trim().toLowerCase();
    this.setState({
      loading: true,
      errorMessage: null,
      searchTerm: query,
      showBuggyComponent: false,
    });
    localStorage.setItem('searchTerm', query);
    if (!query) {
      return this.fetchPage(0);
    }
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (!res.ok) throw new Error(`Pokémon "${query}" not found`);
      const data = await res.json();
      const item = await this.fetchFullData(
        data.name,
        data.species.url.replace('/pokemon-species/', '/pokemon/') as string
      );
      this.setState({ results: [item], count: 1, offset: 0 });
    } catch (e) {
      console.error(e);
      let errorMessage = 'Unknown error occurred during search.';
      if (isError(e)) {
        errorMessage = e.message;
      }
      this.setState({
        errorMessage: errorMessage,
        results: [],
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  private handleTriggerBuggyDisplay = () => {
    this.setState({ showBuggyComponent: true });
  };

  private handleResetSearch = () => {
    this.setState({ searchTerm: '', showBuggyComponent: false });
    localStorage.removeItem('searchTerm');
    this.fetchPage(0);
  };

  componentDidMount() {
    if (this.state.searchTerm) {
      this.handleSearch(this.state.searchTerm);
    } else {
      this.fetchPage(0);
    }
  }
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
    const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

    return (
      <ErrorBoundary>
        <div className="app-container">
          <TopSection onSearch={this.handleSearch} />

          {loading ? (
            <span className="loader"></span>
          ) : errorMessage ? (
            <div className="error-message">{errorMessage}</div>
          ) : (
            <ErrorBoundary>
              <>
                {showBuggyComponent ? (
                  <BuggyComponent />
                ) : (
                  <BottomSection
                    results={results}
                    onErrorButton={this.handleTriggerBuggyDisplay}
                    onResetButton={this.handleResetSearch}
                  />
                )}

                {!searchTerm && totalPages > 1 && !showBuggyComponent && (
                  <div className="pagination-controls">
                    <button
                      onClick={() => this.fetchPage(offset - PAGE_SIZE)}
                      disabled={offset === 0}
                    >
                      Previous
                    </button>
                    <span style={{ margin: '0 20px' }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => this.fetchPage(offset + PAGE_SIZE)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            </ErrorBoundary>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}
