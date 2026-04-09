import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-500 max-w-md mb-8">
            The application encountered an unexpected error. This might be due to a connection issue or a temporary glitch.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }} 
              className="border-slate-200 text-slate-600 font-bold rounded-xl px-8"
            >
              Clear Cache & Logout
            </Button>
          </div>
          <pre className="mt-12 p-4 bg-slate-900 text-slate-100 text-left text-xs rounded-xl overflow-auto max-w-full">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
