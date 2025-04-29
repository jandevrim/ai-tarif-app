"use client";

import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface ErrorBoundaryProps extends WithTranslation {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', margin: '20px', border: '2px dashed red', borderRadius: '8px', backgroundColor: '#fff0f0' }}>
          <h1 style={{ color: 'red', marginBottom: '10px' }}>{t("errorBoundary.title")}</h1>
          <p>{t("errorBoundary.description")}</p>
          {this.state.error && (
            <details style={{ marginTop: '10px', whiteSpace: 'pre-wrap', background: '#ffe0e0', padding: '5px', borderRadius: '4px' }}>
              <summary>{t("errorBoundary.details")}</summary>
              {this.state.error.toString()}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);