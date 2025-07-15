import { Component } from 'react';
import styles from './Cursor.module.css';

export default class GlowCursor extends Component {
  componentDidMount() {
    const cursor = document.querySelector(
      `.${styles.cursorGlow}`
    ) as HTMLDivElement | null;
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY + 16}px`;
    });
  }

  render() {
    return <div className={styles.cursorGlow} />;
  }
}
