import { Component } from "react";
import { Text } from "@pixi/react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Text text="Something went wrong." anchor={0.5} x={150} y={150}></Text>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
