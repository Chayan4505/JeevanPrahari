import React, { useState, useEffect } from 'react';
import { Volume2, Maximize2, Minimize2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AccessibilityBarProps {
  onFontSizeChange?: (size: 'small' | 'normal' | 'large') => void;
  onContrastToggle?: (enabled: boolean) => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  onFontSizeChange,
  onContrastToggle,
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'normal':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
    }
    localStorage.setItem('pahaarsaathi_font_size', fontSize);
    onFontSizeChange?.(fontSize);
  }, [fontSize, onFontSizeChange]);

  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
    localStorage.setItem('pahaarsaathi_high_contrast', highContrast.toString());
    onContrastToggle?.(highContrast);
  }, [highContrast, onContrastToggle]);

  // Restore saved preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem('pahaarsaathi_font_size') as 'small' | 'normal' | 'large' | null;
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }

    const savedContrast = localStorage.getItem('pahaarsaathi_high_contrast');
    if (savedContrast === 'true') {
      setHighContrast(true);
    }
  }, []);

  const announceText = (text: string) => {
    if (screenReaderMode && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    announceText(`Font size set to ${size}`);
  };

  const handleContrast = () => {
    setHighContrast(!highContrast);
    announceText(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="w-full bg-slate-100 text-slate-900 py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-300">
      <div className="w-full max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Government of India Text */}
        <div className="text-xs font-semibold tracking-wide text-slate-700 hidden md:block">
          <span>Government of India</span>
          <span className="mx-2">|</span>
          <span>Ministry of Development of North Eastern Region (MDoNER)</span>
        </div>

        {/* Center/Right: Accessibility Controls */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
          {/* Font Size Resizer */}
          <div className="flex items-center gap-1 bg-white rounded px-2 py-1 border border-slate-300">
            <button
              onClick={() => handleFontSize('small')}
              className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                fontSize === 'small'
                  ? 'bg-gov-navy-900 text-white'
                  : 'bg-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              aria-label="Decrease font size"
              title="Decrease font size (A-)"
            >
              A<span className="text-[10px] align-baseline">−</span>
            </button>
            <button
              onClick={() => handleFontSize('normal')}
              style={{
                  backgroundColor: '#E2E8F0',
                  color: '#1E293B',
                  border: 'none',
                  padding: '0.5rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
              }}
              aria-label="Normal font size"
              title="Normal font size (A)"
            >
              A
            </button>
            <button
              onClick={() => handleFontSize('large')}
              className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                fontSize === 'large'
                  ? 'bg-gov-navy-900 text-white'
                  : 'bg-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              aria-label="Increase font size"
              title="Increase font size (A+)"
            >
              A<span className="text-[10px] align-super">+</span>
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={handleContrast}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all border ${
              highContrast
                ? 'bg-gov-navy-900 text-white border-gov-navy-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
            title="Toggle high contrast mode"
          >
            High Contrast
          </button>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              announceText(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
            }}
            className="px-2 py-1 text-xs font-semibold bg-white text-slate-900 rounded border border-slate-300 hover:border-gov-navy-900 cursor-pointer transition-colors"
            aria-label="Select language"
            title="Select language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Screen Reader Access / Audio Guide */}
          <button
            onClick={() => {
              setScreenReaderMode(!screenReaderMode);
              announceText(
                screenReaderMode
                  ? 'Screen reader mode disabled'
                  : 'Screen reader mode enabled. This website is compatible with screen readers. Use your screen reader navigation commands.'
              );
            }}
            className={`p-1.5 rounded transition-all border ${
              screenReaderMode
                ? 'bg-gov-navy-900 text-white border-gov-navy-900'
                : 'bg-white text-slate-700 border-slate-300 hover:text-slate-900 hover:bg-slate-50'
            }`}
            aria-label={`${screenReaderMode ? 'Disable' : 'Enable'} screen reader mode`}
            title="Screen reader compatibility mode"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Skip to Main Content Link (Hidden but accessible) */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gov-navy-900 focus:text-white focus:font-bold focus:rounded"
            role="link"
            aria-label="Skip to main content"
          >
            Skip to Main Content
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityBar;
