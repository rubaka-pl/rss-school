import styles from './SearchInput.module.css';
import type { SearchInputProps } from '../../types/app';

const SearchInput = ({
  value,
  suggestions,
  onChange,
  onSearch,
  onSuggestionClick,
}: SearchInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
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
};

export default SearchInput;
