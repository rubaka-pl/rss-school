import styles from './DetailsData.module.css';
import type { PropsDetails } from '../../types/app';

const DetailsData = ({ data, onClose }: PropsDetails) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <h2 className={styles.name}>{data.name}</h2>
        <div className={styles.images}>
          {data.animatedImageUrl ? (
            <img src={data.animatedImageUrl} alt={`${data.name} animated`} />
          ) : (
            <img src={data.imageUrl} alt={data.name} />
          )}
        </div>

        <p className={styles.description}>{data.description}</p>

        <ul className={styles.details}>
          <li>
            <strong>Base Experience:</strong> {data.baseExperience}
          </li>
          <li>
            <strong>Height:</strong> {data.height / 10} m
          </li>
          <li>
            <strong>Weight:</strong> {data.weight / 10} kg
          </li>
          <li>
            <strong>Types:</strong> {data.types.join(', ')}
          </li>
          <li>
            <strong>Abilities:</strong> {data.abilities.join(', ')}
          </li>
          <li>
            <strong>Color:</strong> {data.color}
          </li>
          <li>
            <strong>Habitat:</strong> {data.habitat ?? 'Unknown'}
          </li>
          <li>
            <strong>Legendary:</strong> {data.isLegendary ? 'Yes' : 'No'}
          </li>
          <li>
            <strong>Mythical:</strong> {data.isMythical ? 'Yes' : 'No'}
          </li>
        </ul>

        <h3>Stats</h3>
        <ul className={styles.stats}>
          {data.stats.map((s) => (
            <li key={s.name}>
              {s.name}: {s.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailsData;
