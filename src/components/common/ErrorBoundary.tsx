import React, { Component, type ReactNode } from 'react';

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">화면을 불러오는 중 문제가 발생했습니다</h1>
          <p className="text-sm text-gray-500 max-w-md mb-6">
            {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded-xl transition"
            >
              캐시 초기화 후 홈으로
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#2d7a4f] hover:bg-[#1a4a2e] text-white text-sm font-semibold rounded-xl transition"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
