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
  // Light Mode - Purple Dream
  light: {
    name: 'Light Mode',
    mode: 'light',
    background: 'bg-gradient-to-br from-[#7b57eb] via-[#8857eb] to-[#9457eb]',
    headerBg: 'bg-white/80 backdrop-blur-xl border-none shadow-2xl',
    headerText: 'text-gray-900',
    headerAccent: 'text-[#8857eb]',
    cardBg: 'bg-white/90 backdrop-blur-md shadow-2xl border border-white/50',
    cardText: 'text-gray-900',
    cardTextMuted: 'text-gray-600',
    buttonPrimary: 'bg-gradient-to-r from-[#7b57eb] to-[#9457eb] hover:from-[#6f57eb] hover:to-[#8857eb]',
    buttonPrimaryText: 'text-white',
    buttonSecondary: 'bg-white/90 hover:bg-white border-2 border-[#8857eb]',
    buttonSecondaryText: 'text-[#8857eb]',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    accentColor: 'text-[#8857eb]',
    borderColor: 'border-[#9457eb]/20',
    footerText: 'text-gray-600',
    inputBg: 'bg-white/90',
    inputBorder: 'border-[#9457eb]/30 focus:border-[#8857eb] focus:ring-[#8857eb]',
    inputText: 'text-gray-900',
    inputPlaceholder: 'placeholder-gray-500',
    particles: {
      number: { value: 80, density: { enable: true, value_area: 700 } },
      color: { value: '#ffffff' },
      opacity: { value: 0.6, random: false },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 180, color: '#ffffff', opacity: 0.25, width: 1.2 },
      move: { enable: true, speed: 1.2, direction: 'none', random: false, straight: false, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false, mode: 'push' }, resize: true },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.5 } }, push: { particles_nb: 3 } },
    },
  },

  // Dark Mode - Deep Purple Night
  dark: {
    name: 'Dark Mode',
    mode: 'dark',
    background: 'bg-gradient-to-br from-[#6f57eb] via-[#7b57eb] to-[#8857eb]',
    headerBg: 'bg-[#6f57eb]/80 backdrop-blur-xl border-none shadow-2xl',
    headerText: 'text-white',
    headerAccent: 'text-[#b957eb]',
    cardBg: 'bg-[#7b57eb]/80 backdrop-blur-md shadow-2xl border border-[#9457eb]/30',
    cardText: 'text-white',
    cardTextMuted: 'text-gray-200',
    buttonPrimary: 'bg-gradient-to-r from-[#ad57eb] to-[#b957eb] hover:from-[#9457eb] hover:to-[#ad57eb]',
    buttonPrimaryText: 'text-white',
    buttonSecondary: 'bg-[#8857eb]/80 hover:bg-[#9457eb]/80 border-2 border-[#ad57eb]',
    buttonSecondaryText: 'text-white',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-100',
    accentColor: 'text-[#b957eb]',
    borderColor: 'border-[#9457eb]/30',
    footerText: 'text-gray-200',
    inputBg: 'bg-[#7b57eb]/60',
    inputBorder: 'border-[#9457eb]/40 focus:border-[#ad57eb] focus:ring-[#ad57eb]',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder-gray-300',
    particles: {
      number: { value: 100, density: { enable: true, value_area: 600 } },
      color: { value: '#ffffff' },
      opacity: { value: 0.7, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.3, width: 1 },
      move: { enable: true, speed: 0.8, direction: 'none', random: true, straight: false, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false, mode: 'push' }, resize: true },
      modes: { grab: { distance: 180, line_linked: { opacity: 0.6 } }, push: { particles_nb: 4 } },
    },
  },
};

export type ParticlePresetKey = keyof typeof PARTICLE_PRESETS;
