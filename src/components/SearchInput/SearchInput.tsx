import React from 'react';
import styles from './SearchInput.module.css';
import type { SearchInputProps } from '../../types/app';

export default class SearchInput extends React.Component<SearchInputProps> {
  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') this.props.onSearch();
  };

  render() {
    const { value, suggestions, onChange, onSearch, onSuggestionClick } =
      this.props;

    return (
      <div className={styles.wrapper}>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onKeyDown={this.handleKeyDown}
        />
        <button className={styles.button} onClick={onSearch}>
          Search
        </button>
        {suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((s) => (
              <li key={s} onClick={() => onSuggestionClick(s)}>
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
