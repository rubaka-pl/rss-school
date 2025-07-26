import styles from './BottomSection.module.css';
import type { BottomSectionProps } from '../../types/app';
import { Link } from 'react-router-dom';

const BottomSection = ({
  results,
  onResetButton,
  onErrorButton,
  searchParams,
  setSearchParams,
}: BottomSectionProps) => {
  const renderEmpty = () => (
    <div className={styles.empty}>
      <p>
        <span className={styles.hint}>This is a Pokémon search.</span>
        <br />
        Try one of: Pikachu, Charmander, Bulbasaur, Squirtle.
      </p>
    </div>
  );

  const renderTable = () => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Pokemon</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item) => (
          <tr key={item.name}>
            <td className={styles.nameCell}>
              <div className={styles.pokemonBox}>
                {item.imageUrl && (
                  <img
                    className={styles.pokemonImage}
                    src={item.imageUrl}
                    alt={item.name}
                  />
                )}
                <div className={styles.pokemonName}>{item.name}</div>
              </div>
            </td>

            <td className={styles.detailsCell}>
              <p>{item.description}</p>
              <ul className={styles.stats}>
                <li>
                  <strong>Height:</strong> {item.height / 10} m
                </li>
                <li>
                  <strong>Weight:</strong> {item.weight / 10} kg
                </li>
                <li>
                  <strong>Types:</strong> {item.types.join(', ')}
                </li>
                <li>
                  <strong>Abilities:</strong> {item.abilities.join(', ')}
                </li>
                <li>
                  <button
                    className={styles.detailsLink}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('details', item.name);
                      setSearchParams(newParams);
                    }}
                  >
                    Learn More
                  </button>
                </li>
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <section className={styles.wrapper}>
      {results.length === 0 ? renderEmpty() : renderTable()}

      <div className={styles.controls}>
        <button className={styles.resetButton} onClick={onResetButton}>
          Reset Search
        </button>
        <button className={styles.errorButton} onClick={onErrorButton}>
          Throw Error
        </button>
        <Link to="/about" className={styles.navButton}>
          Go to About
        </Link>
        <Link to="/404" className={styles.navButton}>
          Go to Not Found
        </Link>
      </div>
    </section>
  );
};

export default BottomSection;
