import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Card, CardContent } from './ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-destructive font-medium">Something went wrong</p>
              <p className="text-sm text-muted-foreground">{this.state.error?.message}</p>
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Reset
              </button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
