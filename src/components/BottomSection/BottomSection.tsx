import React from 'react';
import styles from './BottomSection.module.css';
import type { BottomSectionProps } from '../../types/app';

export default class BottomSection extends React.Component<BottomSectionProps> {
  renderEmpty() {
    return (
      <div className={styles.empty}>
        <p>
          <span className={styles.hint}>This is a Pokémon search.</span>
          <br />
          Try one of: Pikachu, Charmander, Bulbasaur, Squirtle.
        </p>
      </div>
    );
  }

  renderTable() {
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Pokemon</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {this.props.results.map((item) => (
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
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    const { results, onResetButton, onErrorButton } = this.props;

    return (
      <section className={styles.wrapper}>
        {results.length === 0 ? this.renderEmpty() : this.renderTable()}

        <div className={styles.controls}>
          <button className={styles.resetButton} onClick={onResetButton}>
            Reset Search
          </button>
          <button className={styles.errorButton} onClick={onErrorButton}>
            Throw Error
          </button>
        </div>
      </section>
    );
  }
}
