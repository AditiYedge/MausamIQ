import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("MausamIQ ErrorBoundary caught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', background: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: '#FEE2E2', borderRadius: '50%', color: '#991B1B', marginBottom: '16px' }}>
            <AlertOctagon size={32} />
          </div>
          <h2 style={{ fontSize: '18px', color: '#991B1B', marginBottom: '8px' }}>Something went wrong</h2>
          <p style={{ color: '#4A5568', fontSize: '14px', marginBottom: '20px' }}>
            The application encountered an unexpected display error. Please reload the page to resume.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload MausamIQ
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
