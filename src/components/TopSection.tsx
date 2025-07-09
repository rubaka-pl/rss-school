// src/components/TopSection.tsx
import React from 'react';
import '../App.css';
import Logo from '../assets/logo.svg';

interface TopSectionProps {
  onSearch: (query: string) => void;
}

interface TopSectionState {
  suggestions: string[];
}

interface PokemonListResponse {
  results: { name: string }[];
}

export class TopSection extends React.Component<
  TopSectionProps,
  TopSectionState
> {
  private allNames: string[] = [];
  private inputRef = React.createRef<HTMLInputElement>();

  state: TopSectionState = {
    suggestions: [],
  };
  async componentDidMount() {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000');
      const json = (await res.json()) as PokemonListResponse;
      this.allNames = json.results.map((r) => r.name);
    } catch (e) {
      console.error('Failed to load Pokémon list:', e);
    }
  }

  handleInput = () => {
    const query = this.inputRef.current?.value.toLowerCase() ?? '';
    if (!query) {
      this.setState({ suggestions: [] });
      return;
    }
    const matches = this.allNames
      .filter((name) => name.startsWith(query))
      .slice(0, 5);
    this.setState({ suggestions: matches });
  };

  handleSuggestionClick = (name: string) => {
    if (this.inputRef.current) {
      this.inputRef.current.value = name;
      this.setState({ suggestions: [] });
    }
    this.props.onSearch(name);
  };

  handleSearch = () => {
    const query = this.inputRef.current?.value ?? '';
    this.props.onSearch(query);
    this.setState({ suggestions: [] });
  };

  render() {
    const { suggestions } = this.state;

    return (
      <header className="top-section">
        <img src={Logo} alt="Logo" className="top-logo" />
        <p className="rs-school-note">
          Task 1: React class-components assignment for RS School.&nbsp; <br />
          Created by{' '}
          <a
            href="https://github.com/rubaka-pl"
            target="_blank"
            rel="noopener noreferrer"
          >
            @rubaka-pl
          </a>
        </p>
        <div className="search-bar">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search..."
              defaultValue={localStorage.getItem('searchTerm') ?? ''}
              ref={this.inputRef}
              onChange={this.handleInput}
              className="search-input"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((name) => (
                  <li
                    key={name}
                    onClick={() => this.handleSuggestionClick(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={this.handleSearch}>Search</button>
        </div>
      </header>
    );
  }
}
