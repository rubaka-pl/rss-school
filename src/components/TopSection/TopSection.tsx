import Logo from '../../assets/logo.svg';
import styles from './TopSection.module.css';
import SearchInput from '../SearchInput/SearchInput';
import Loader from '../Loader/Loader';
import type { TopSectionProps, TopSectionState } from '../../types/app';
import { fetchPokemonSuggestions } from '../../api/pokemonApi';
import { Component } from 'react';
export default class TopSection extends Component<
  TopSectionProps,
  TopSectionState
> {
  private allNames: string[] = [];

  state: TopSectionState = {
    searchTerm: localStorage.getItem('searchTerm') || '',
    suggestions: [],
  };

  async componentDidMount() {
    this.allNames = await fetchPokemonSuggestions();
  }

  handleChange = (term: string) => {
    this.setState({ searchTerm: term });

    if (!term) {
      this.setState({ suggestions: [] });
      return;
    }

    const q = term.toLowerCase();
    const matches = this.allNames
      .filter((name) => name.startsWith(q))
      .slice(0, 6);
    this.setState({ suggestions: matches });
  };

  handleSuggestionClick = (name: string) => {
    localStorage.setItem('searchTerm', name);
    this.setState({ searchTerm: name, suggestions: [] });
    this.props.onSearch(name);
  };

  handleSearch = () => {
    const term = this.state.searchTerm.trim();
    localStorage.setItem('searchTerm', term);
    this.setState({ suggestions: [] });
    this.props.onSearch(term);
  };

  render() {
    const { searchTerm, suggestions } = this.state;
    const { loading } = this.props;

    return (
      <header className={styles.topSection}>
        {loading ? (
          <Loader />
        ) : (
          <img src={Logo} alt="Logo" className={styles.logo} />
        )}

        <SearchInput
          value={searchTerm}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          suggestions={suggestions}
          onSuggestionClick={this.handleSuggestionClick}
        />
      </header>
    );
  }
}
