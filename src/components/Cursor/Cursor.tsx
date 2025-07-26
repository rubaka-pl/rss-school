import { useEffect } from 'react';
import styles from './Cursor.module.css';

const GlowCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(
      `.${styles.cursorGlow}`
    ) as HTMLDivElement | null;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY + 16}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div className={styles.cursorGlow} />;
};

export default GlowCursor;
