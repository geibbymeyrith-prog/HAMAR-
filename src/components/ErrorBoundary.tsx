import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  // Explicit declarations to satisfy TS in strict environments
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4" id="error-boundary-view">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-sm border border-stone-200" id="error-boundary-card">
            <h2 className="text-xl font-semibold text-stone-900 mb-4 font-sans" id="error-boundary-title">
              Terjadi Kesalahan Aplikasi
            </h2>
            <p className="text-sm text-stone-600 mb-6 font-sans leading-relaxed" id="error-boundary-desc">
              Aplikasi mengalami kendala saat memuat halaman. Silakan muat ulang halaman ini atau hubungi admin jika masalah berlanjut.
            </p>
            <div className="bg-stone-50 rounded-lg p-4 mb-6 overflow-auto max-h-40 border border-stone-100" id="error-boundary-log-container">
              <pre className="text-xs text-stone-500 font-mono whitespace-pre-wrap break-all" id="error-boundary-log">
                {this.state.error?.toString() || 'Unknown error'}
              </pre>
            </div>
            <button
              id="error-boundary-reload-btn"
              onClick={() => window.location.reload()}
              className="w-full bg-[#1A1A1A] hover:bg-black text-white py-2.5 px-4 rounded-lg font-sans text-sm font-medium transition-colors"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
