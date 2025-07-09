// src/components/ErrorBoundary.tsx
import React from 'react';
import '../App.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  componentStack: string;
}

export class ErrorBoundary extends React.Component<
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
        <section className="error-boundary">
          <h2>Error:</h2>
          <p>
            <strong>{this.state.error?.message ?? 'Unknown Error.'}</strong>
          </p>
          <details className="error-details">
            {this.state.componentStack}
          </details>
          <button
            className="error-return-button"
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
