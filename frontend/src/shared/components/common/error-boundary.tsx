import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600">
                Something went wrong
              </h2>
              <p className="mt-2 text-gray-600">
                Please refresh the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

