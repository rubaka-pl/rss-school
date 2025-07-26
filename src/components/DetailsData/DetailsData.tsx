import styles from './DetailsData.module.css';
import type { PropsDetails } from '../../types/app';

const DetailsData = ({ data, onClose }: PropsDetails) => {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2>{data.name}</h2>
        <img src={data.imageUrl} alt={data.name} className={styles.sprite} />
        <p>{data.description}</p>
        <ul className={styles.stats}>
          <li>Height: {data.height / 10} m</li>
          <li>Weight: {data.weight / 10} kg</li>
          <li>Types: {data.types.join(', ')}</li>
          <li>Abilities: {data.abilities.join(', ')}</li>
        </ul>
      </div>
    </div>
  );
};
export default DetailsData;
