// src/components/BottomSection.tsx
import React from 'react';
import '../App.css';

interface Result {
  name: string;
  description: string;
  imageUrl: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
}

interface BottomSectionProps {
  results: Result[];
  onErrorButton: () => void;
  onResetButton: () => void;
}

export class BottomSection extends React.Component<BottomSectionProps> {
  render() {
    const { results, onErrorButton, onResetButton } = this.props;

    if (results.length === 0) {
      return (
        <section className="bottom-section">
          <p>
            <span style={{ fontSize: 26, color: 'red' }}>
              This is a Pokémon search.
            </span>{' '}
            <br /> Try one of the popular names: Pikachu, Charmander, Bulbasaur,
            Squirtle.
          </p>
        </section>
      );
    }

    return (
      <section className="bottom-section">
        <table className="results-table two-columns">
          <thead>
            <tr>
              <th scope="col">Pokemon</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.name}>
                {/* column 1 */}
                <td className="name-cell">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="pokemon-image"
                    />
                  )}
                  <div className="pokemon-name">{item.name}</div>
                </td>

                {/* column 2 */}
                <td className="details-cell">
                  <p className="description">{item.description}</p>
                  <ul className="stats-list">
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
        <button
          style={{ backgroundColor: '#007e5e' }}
          className="reset-button"
          onClick={onResetButton}
        >
          Reset Search
        </button>
        <button className="error-button" onClick={onErrorButton}>
          Error Button
        </button>
      </section>
    );
  }
}
