import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="m-4">
          <h4>Something went wrong</h4>
          <p>{this.state.error?.message || 'An unknown error occurred.'}</p>
          <p>Please try again later.</p>
        </Alert>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;