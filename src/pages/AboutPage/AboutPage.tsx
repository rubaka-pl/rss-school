import { Link } from 'react-router-dom';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1>About the Pokédex Project</h1>
      <p>
        This Pokédex was created as part of the React course at{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School
        </a>
        .
      </p>
      <p>
        The application allows users to search for Pokémon, view detailed stats,
        and navigate through a paginated list of results. You can click on a
        Pokémon to see its type, abilities, height, weight, and an image — all
        fetched live from the PokéAPI.
      </p>
      <p>Features include:</p>
      <ul>
        <li>Search by name with autocomplete suggestions</li>
        <li>Pagination with URL synchronization</li>
        <li>Detail view with dynamic routing</li>
        <li>Error boundary with test component</li>
        <li>Local storage support</li>
        <li>Custom glowing cursor for fun =)</li>
      </ul>
      <p>
        This project demonstrates the use of React functional components, hooks,
        React Router (v7), and modular CSS.
      </p>
      <p className="author">
        WORK DONE BY RUBAKA-PL <br />
        GitHub:{' '}
        <a
          href="https://github.com/rubaka-pl"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/rubaka-pl
        </a>
      </p>{' '}
      <Link to="/">← Back to Pokédex</Link>
    </div>
  );
};

export default AboutPage;
