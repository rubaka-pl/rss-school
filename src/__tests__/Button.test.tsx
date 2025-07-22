import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Button from '../components/Button/Button';
import styles from '../components/Button/Button.module.css';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('uses type="button" and applies the CSS class', () => {
    render(<Button onClick={() => {}}>Test</Button>);
    const btn = screen.getByRole('button', { name: /test/i });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass(styles.button);
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Press</Button>);
    const btn = screen.getByRole('button', { name: /press/i });
    await userEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
