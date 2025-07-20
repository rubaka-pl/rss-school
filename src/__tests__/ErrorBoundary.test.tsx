import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('logs error to console', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();

    const calls = consoleErrorSpy.mock.calls;
    const rawCall = calls.find(
      (args) => args[0] === 'ErrorBoundary caught an error:'
    );
    expect(rawCall).toBeDefined();

    const callArgs = rawCall;
    if (!callArgs) {
      throw new Error('Expected ErrorBoundary console.error call not found');
    }

    const [message, errorArg, errorInfoArg] = callArgs;

    expect(message).toBe('ErrorBoundary caught an error:');
    expect(errorArg).toBeInstanceOf(Error);
    expect((errorArg as Error).message).toBe('Test error');
    expect(errorInfoArg).toHaveProperty('componentStack');

    consoleErrorSpy.mockRestore();
  });
});
