import '../ThemeToggle.css';
import { useTheme } from './Themecontext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          {theme === 'light' ? '☀️' : '🌙'}
        </div>
      </div>
    </button>
  );
}