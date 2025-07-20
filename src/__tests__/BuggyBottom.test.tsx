import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import BuggyBottom from '../components/BuggyBottom/BuggyBottom';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

describe('BuggyBottom', () => {
  it('throws when mounted alone', () => {
    expect(() => render(<BuggyBottom />)).toThrow(/Error from BuggyBottom/);
  });

  it('renders fallback UI when wrapped in ErrorBoundary', () => {
    render(
      <ErrorBoundary>
        <BuggyBottom />
      </ErrorBoundary>
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Something went wrong.');

    expect(screen.getByText(/Error from BuggyBottom/)).toBeInTheDocument();

    const returnBtn = screen.getByRole('button', { name: /return/i });
    expect(returnBtn).toBeInTheDocument();
  });
});
