import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles['checkbox-wrapper']}>
      <label className={styles['pokeball-label']}>
        <input
          type="radio"
          name="theme"
          value="light"
          className={styles['pokeball-input']}
          checked={theme === 'light'}
          onChange={() => toggleTheme('light')}
        />
        <div className={styles['pokeball']}></div>
        <span className={styles['theme-label-text']}>Light</span>
      </label>

      <label className={styles['pokeball-label']}>
        <input
          type="radio"
          name="theme"
          value="dark"
          className={styles['pokeball-input']}
          checked={theme === 'dark'}
          onChange={() => toggleTheme('dark')}
        />
        <div className={styles['pokeball']}></div>
        <span className={styles['theme-label-text']}>Dark</span>
      </label>
    </div>
  );
};

export default ThemeToggle;
