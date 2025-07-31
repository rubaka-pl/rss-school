import styles from './BottomSection.module.css';
import type { BottomSectionProps } from '../../types/app';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { toggleItem, clearSelection } from '../../features/selectedItemsSlice';

const BottomSection = ({
  results,
  onResetButton,
  searchParams,
  setSearchParams,
}: BottomSectionProps) => {
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.items
  );

  const dispatch = useDispatch();

  const renderEmpty = () => (
    <div className={styles.empty}>
      <p>
        <span className={styles.hint}>This is a Pokémon search.</span>
        <br />
        Try one of: Pikachu, Charmander, Bulbasaur, Squirtle.
      </p>
    </div>
  );

  const downloadCSV = (
    items: Record<
      string,
      { name: string; description: string; detailsUrl: string }
    >
  ) => {
    const rows = Object.values(items).map((item) => ({
      Name: item.name,
      Description: item.description,
      DetailsURL: item.detailsUrl,
    }));

    const csvContent =
      'Name,Description,DetailsURL\n' +
      rows
        .map((row) => `${row.Name},"${row.Description}",${row.DetailsURL}`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${rows.length}_items.csv`;
    link.click();
  };

  const renderTable = () => (
    <div className={styles.tableWrapper}>
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
                      type="button"
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
                  <li>
                    <label className={styles.fancyCheckbox}>
                      <input
                        type="checkbox"
                        checked={item.name in selectedItems}
                        onChange={() =>
                          dispatch(
                            toggleItem({
                              id: item.name,
                              name: item.name,
                              description: item.description,
                              detailsUrl:
                                'https://pokeapi.co/api/v2/pokemon/' +
                                item.name,
                            })
                          )
                        }
                      />
                      <span className={styles.checkboxCustom}></span>
                      Select
                    </label>
                  </li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className={styles.wrapper}>
      {results.length === 0 ? renderEmpty() : renderTable()}

      {Object.keys(selectedItems).length > 0 && (
        <div className={styles.flyout}>
          <p>{Object.keys(selectedItems).length} Pokémon selected</p>
          <button
            className={styles.flyoutButton}
            onClick={() => dispatch(clearSelection())}
          >
            Unselect All
          </button>
          <button
            className={styles.flyoutButton}
            onClick={() => downloadCSV(selectedItems)}
          >
            Download
          </button>
        </div>
      )}

      <div className={styles.controls}>
        <button className={styles.resetButton} onClick={onResetButton}>
          Reset Search
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
