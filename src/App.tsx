import { Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import GlowCursor from './components/Cursor/Cursor';

const App = () => {
  return (
    <ErrorBoundary>
      <GlowCursor />
      <ThemeToggle />
      <Outlet />
    </ErrorBoundary>
  );
};

export default App;
