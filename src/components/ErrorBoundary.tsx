import { Component, ErrorInfo, ReactNode } from "react";
import Error from "./Error";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <div className={`wh-full bg-white flex-center relative`}>
        <Error msg={`ระบบเกิดข้อผิดพลาด #ErrorBoundary`} />
      </div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
