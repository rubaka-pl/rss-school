// src/__tests__/Loader.test.tsx
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Loader from '../components/Loader/Loader';
import styles from '../components/Loader/Loader.module.css';

describe('Loader', () => {
  it('renders a span with the loader CSS class', () => {
    const { container } = render(<Loader />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass(styles.loader);
  });

  it('renders exactly one element', () => {
    const { container } = render(<Loader />);
    // Should only render the single <span>
    expect(container.childElementCount).toBe(1);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });
});
