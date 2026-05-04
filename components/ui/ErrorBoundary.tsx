"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  toolName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`Tool error (${this.props.toolName}):`, error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-card border border-error/30 bg-red-50 p-4 text-body"
        >
          <p className="font-semibold text-navy">
            Something went wrong loading {this.props.toolName}.
          </p>
          <p className="mt-2 text-sm">
            Refresh the page or try again. If the issue persists, contact us via
            the support form.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
