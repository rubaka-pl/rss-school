import { useState, useEffect, useCallback } from 'react';
import Logo from '../../assets/logo.svg';
import styles from './TopSection.module.css';
import SearchInput from '../SearchInput/SearchInput';
import Loader from '../Loader/Loader';
import { fetchPokemonList } from '../../api/pokemonApi';
import type { TopSectionProps } from '../../types/app';

const useLocalStorageState = (key: string, defaultValue: string) => {
  const [value, setValue] = useState(
    () => localStorage.getItem(key) || defaultValue
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};

const TopSection = ({ onSearch, loading, onReset }: TopSectionProps) => {
  const [searchTerm, setSearchTerm] = useLocalStorageState('searchTerm', '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchNames = async () => {
      const names = await fetchPokemonList();
      setAllNames(names);
    };
    fetchNames();
  }, []);

  const handleChange = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (!term) {
        setSuggestions([]);
        return;
      }

      const q = term.toLowerCase();
      const matches = allNames.filter((name) => name.startsWith(q)).slice(0, 6);
      setSuggestions(matches);
    },
    [allNames, setSearchTerm]
  );

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setSuggestions([]);
    onSearch(name);
  };

  const handleSearch = () => {
    const term = searchTerm.trim();
    setSuggestions([]);
    onSearch(term);
  };
  const handleLogoClick = () => {
    onReset();
  };
  return (
    <header className={styles.topSection}>
      {loading ? (
        <Loader />
      ) : (
        <img
          src={Logo}
          alt="Logo"
          className={styles.logo}
          onClick={() => {
            handleLogoClick();
          }}
          style={{ cursor: 'pointer' }}
        />
      )}

      <SearchInput
        value={searchTerm}
        onChange={handleChange}
        onSearch={handleSearch}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />
    </header>
  );
};

export default TopSection;
