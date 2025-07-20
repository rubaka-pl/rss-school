import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import GlowCursor from '../components/Cursor/Cursor';
import styles from '../components/Cursor/Cursor.module.css';

describe('GlowCursor', () => {
  let cursor: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    render(<GlowCursor />);
    const el = document.querySelector(`.${styles.cursorGlow}`);
    expect(el).not.toBeNull();
    cursor = el as HTMLElement;
  });
  it('renders a div with the correct class', () => {
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass(styles.cursorGlow);
  });

  it('moves the cursor element on mousemove', () => {
    expect(cursor.style.left).toBe('');
    expect(cursor.style.top).toBe('');

    const moveEvent = new MouseEvent('mousemove', {
      clientX: 123,
      clientY: 456,
      bubbles: true,
    });
    document.dispatchEvent(moveEvent);

    expect(cursor.style.left).toBe('123px');
    expect(cursor.style.top).toBe(`${456 + 16}px`);
  });
});
