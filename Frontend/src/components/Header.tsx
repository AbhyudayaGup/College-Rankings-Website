import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X, Moon, Sun } from 'lucide-react';
import { PARTICLE_PRESETS, ParticlePresetKey, ThemePreset } from './particlePresets';

export type HeaderProps = {
  currentPreset: ParticlePresetKey;
  onPresetChange: (key: ParticlePresetKey) => void;
};

export const Header: React.FC<HeaderProps> = ({ currentPreset, onPresetChange }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const theme: ThemePreset = PARTICLE_PRESETS[currentPreset];
  const isDark = theme.mode === 'dark';

  const toggleTheme = () => {
    onPresetChange(isDark ? 'light' : 'dark');
  };

  return (
    <header className={`relative ${theme.headerBg} ${theme.headerText} overflow-visible rounded-b-3xl`}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <GraduationCap size={42} className={theme.accentColor} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{PARTICLE_PRESETS[currentPreset].name === 'Dark Mode' ? '🎓 ' : ''}College Rankings</h1>
              <p className={`${theme.headerAccent} text-sm font-medium`}>Global University Aggregator</p>
            </div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            {/* Desktop navigation */}
            <nav className="hidden md:flex gap-8">
              <Link to="/" className={`hover:${theme.accentColor} transition font-semibold text-base ${theme.headerAccent}`}>
                Home
              </Link>
              <Link to="/international" className={`hover:${theme.accentColor} transition font-semibold text-base ${theme.headerAccent}`}>
                International
              </Link>
              <Link to="/american" className={`hover:${theme.accentColor} transition font-semibold text-base ${theme.headerAccent}`}>
                US Colleges
              </Link>
            </nav>

            {/* Dark/Light Mode Toggle Slider */}
            <button
              onClick={toggleTheme}
              className={`relative flex items-center w-16 h-8 rounded-full p-1 transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700 border border-gray-600' 
                  : 'bg-gray-200 border border-gray-300'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {/* Slider thumb */}
              <div
                className={`absolute w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                  isDark 
                    ? 'translate-x-8 bg-gray-900' 
                    : 'translate-x-0 bg-white'
                }`}
              >
                {isDark ? (
                  <Moon size={14} className="text-gray-300" />
                ) : (
                  <Sun size={14} className="text-amber-500" />
                )}
              </div>
              {/* Background icons */}
              <Sun size={12} className={`ml-1 ${isDark ? 'text-gray-500' : 'text-transparent'}`} />
              <Moon size={12} className={`ml-auto mr-1 ${isDark ? 'text-transparent' : 'text-gray-400'}`} />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className={`md:hidden mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col gap-3">
              <Link to="/" className="hover:opacity-70 transition font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/international" className="hover:opacity-70 transition font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                International Rankings
              </Link>
              <Link to="/american" className="hover:opacity-70 transition font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                US Colleges
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
