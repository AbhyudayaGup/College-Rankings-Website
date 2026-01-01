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
  // Light Mode - Minimal Light with Purple Accents
  light: {
    name: 'Light Mode',
    mode: 'light',
    background: 'bg-gradient-to-br from-purple-50 via-white to-indigo-50',
    headerBg: 'bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-lg',
    headerText: 'text-gray-900',
    headerAccent: 'text-purple-600',
    cardBg: 'bg-white/90 backdrop-blur-sm shadow-lg border border-purple-50',
    cardText: 'text-gray-900',
    cardTextMuted: 'text-gray-500',
    buttonPrimary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    buttonPrimaryText: 'text-white',
    buttonSecondary: 'bg-white hover:bg-purple-50 border-2 border-purple-300',
    buttonSecondaryText: 'text-purple-700',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accentColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    footerText: 'text-gray-500',
    inputBg: 'bg-white',
    inputBorder: 'border-purple-300 focus:border-purple-500 focus:ring-purple-500',
    inputText: 'text-gray-900',
    inputPlaceholder: 'placeholder-gray-400',
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#8857eb' },
      opacity: { value: 0.4, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 150, color: '#a057eb', opacity: 0.12, width: 0.8 },
      move: { enable: true, speed: 0.8, direction: 'none', random: true, straight: false, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false, mode: 'push' }, resize: true },
      modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } }, push: { particles_nb: 0 } },
    },
  },

  // Dark Mode - Elegant Deep Blue with Purple Accents
  dark: {
    name: 'Dark Mode',
    mode: 'dark',
    background: 'bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900',
    headerBg: 'bg-blue-900/60 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl',
    headerText: 'text-white',
    headerAccent: 'text-purple-300',
    cardBg: 'bg-blue-900/40 backdrop-blur-lg shadow-2xl border border-purple-500/20',
    cardText: 'text-white',
    cardTextMuted: 'text-purple-200',
    buttonPrimary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
    buttonPrimaryText: 'text-white',
    buttonSecondary: 'bg-blue-800/50 hover:bg-blue-700/50 border-2 border-purple-500/30',
    buttonSecondaryText: 'text-purple-200',
    textPrimary: 'text-white',
    textSecondary: 'text-purple-100',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    footerText: 'text-purple-300',
    inputBg: 'bg-blue-900/50',
    inputBorder: 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder-purple-300',
    particles: {
      number: { value: 100, density: { enable: true, value_area: 800 } },
      color: { value: '#9457eb' },
      opacity: { value: 0.35, random: true },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 140, color: '#7b57eb', opacity: 0.08, width: 0.6 },
      move: { enable: true, speed: 0.6, direction: 'none', random: true, straight: false, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false, mode: 'push' }, resize: true },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.2 } }, push: { particles_nb: 0 } },
    },
  },
};

export type ParticlePresetKey = keyof typeof PARTICLE_PRESETS;
