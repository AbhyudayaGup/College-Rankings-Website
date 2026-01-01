export type ThemeMode = 'dark' | 'light';

export type ThemePreset = {
  name: string;
  mode: ThemeMode;
  // Background colors
  background: string;
  // Header styles
  headerBg: string;
  headerText: string;
  headerAccent: string;
  // Card styles
  cardBg: string;
  cardText: string;
  cardTextMuted: string;
  // Button styles
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  // Text styles
  textPrimary: string;
  textSecondary: string;
  // Accent color for icons/highlights
  accentColor: string;
  // Footer/border colors
  borderColor: string;
  footerText: string;
  // Input styles
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  // Particle config
  particles: {
    number: { value: number; density: { enable: boolean; value_area: number } };
    color: { value: string };
    opacity: { value: number; random: boolean };
    size: { value: number; random: boolean };
    line_linked: { enable: boolean; distance: number; color: string; opacity: number; width: number };
    move: { enable: boolean; speed: number; direction: string; random: boolean; straight: boolean; out_mode: string };
  };
  interactivity: {
    events: { onhover: { enable: boolean; mode: string }; onclick: { enable: boolean; mode: string }; resize: boolean };
    modes: { grab?: { distance: number; line_linked: { opacity: number } }; push?: { particles_nb: number }; repulse?: { distance: number; duration: number }; bubble?: { distance: number; size: number; duration: number; opacity: number; speed: number } };
  };
};

export const PARTICLE_PRESETS: Record<string, ThemePreset> = {
  // Light Mode - Minimal Light
  light: {
    name: 'Light Mode',
    mode: 'light',
    background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    headerBg: 'bg-white border-b border-gray-200 shadow-sm',
    headerText: 'text-gray-900',
    headerAccent: 'text-gray-600',
    cardBg: 'bg-white shadow-lg border border-gray-100',
    cardText: 'text-gray-900',
    cardTextMuted: 'text-gray-500',
    buttonPrimary: 'bg-gray-900 hover:bg-gray-800',
    buttonPrimaryText: 'text-white',
    buttonSecondary: 'bg-white hover:bg-gray-50 border-2 border-gray-300',
    buttonSecondaryText: 'text-gray-700',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accentColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    footerText: 'text-gray-500',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300 focus:border-gray-500 focus:ring-gray-500',
    inputText: 'text-gray-900',
    inputPlaceholder: 'placeholder-gray-400',
    particles: {
      number: { value: 60, density: { enable: true, value_area: 700 } },
      color: { value: '#374151' },
      opacity: { value: 0.5, random: false },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 180, color: '#6b7280', opacity: 0.35, width: 1.2 },
      move: { enable: true, speed: 1.2, direction: 'none', random: false, straight: false, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.6 } }, push: { particles_nb: 3 } },
    },
  },

  // Dark Mode - Cosmic Night (Enhanced visibility)
  dark: {
    name: 'Dark Mode',
    mode: 'dark',
    background: 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950',
    headerBg: 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg',
    headerText: 'text-white',
    headerAccent: 'text-gray-300',
    cardBg: 'bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-700/50',
    cardText: 'text-white',
    cardTextMuted: 'text-gray-400',
    buttonPrimary: 'bg-white hover:bg-gray-100',
    buttonPrimaryText: 'text-gray-900',
    buttonSecondary: 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600',
    buttonSecondaryText: 'text-gray-200',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    accentColor: 'text-gray-300',
    borderColor: 'border-gray-700',
    footerText: 'text-gray-400',
    inputBg: 'bg-gray-800',
    inputBorder: 'border-gray-600 focus:border-gray-400 focus:ring-gray-400',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder-gray-500',
    particles: {
      number: { value: 120, density: { enable: true, value_area: 600 } },
      color: { value: '#e5e7eb' },
      opacity: { value: 0.8, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 150, color: '#9ca3af', opacity: 0.5, width: 1 },
      move: { enable: true, speed: 0.8, direction: 'none', random: true, straight: false, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 180, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } },
    },
  },
};

export type ParticlePresetKey = keyof typeof PARTICLE_PRESETS;
