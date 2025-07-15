import React from 'react';
import type { ErrorBoundaryState } from '../../types/app';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    componentStack: '',
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ componentStack: errorInfo.componentStack ?? '' });
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles['error-boundary']}>
          <h2>Something went wrong.</h2>
          <p>
            <strong>{this.state.error?.message ?? 'Unknown Error'}</strong>
          </p>
          <details className={styles['error-details']}>
            {this.state.componentStack}
          </details>
          <button
            className={styles['error-return-button']}
            onClick={() => window.location.reload()}
          >
            Return
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
