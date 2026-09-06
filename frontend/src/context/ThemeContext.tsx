import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('pahaarsaathi_theme');
    if (saved) return saved as 'light' | 'dark';

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light'; // Default to GIGW-compliant light mode
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pahaarsaathi_theme', newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  };

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement;
    const body = document.body;

    // Apply dark class for Tailwind
    if (newTheme === 'dark') {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f1f5f9';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      body.style.backgroundColor = '#f8fafc';
      body.style.color = '#1e293b';
    }

    // Force React re-render by dispatching custom event
    window.dispatchEvent(new Event('themechange'));
  };

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  // Listen for storage changes (multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pahaarsaathi_theme' && e.newValue) {
        setTheme(e.newValue as 'light' | 'dark');
        applyTheme(e.newValue as 'light' | 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
