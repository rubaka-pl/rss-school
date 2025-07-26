import styles from './Button.module.css';
import type { ButtonProps } from '../../types/app';

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
