# Animated Particle Background with Lines - Implementation Guide

This guide shows you how to build the exact animated particle background with connecting lines and dual color schemes (light/dark mode) used in the College Rankings website.

## 🎨 Overview

The background features:
- **Animated particles** that float across the screen
- **Connecting lines** between nearby particles
- **Interactive hover effect** - lines connect to your mouse cursor
- **Click to add particles** - add more particles by clicking
- **Two color schemes**: Light mode and Dark mode
- **Responsive** and optimized performance

---

## 📦 Dependencies

```bash
npm install react
# Tailwind CSS for styling (optional but recommended)
npm install -D tailwindcss postcss autoprefixer
```

---

## 🎯 Step 1: Create the Particle Presets Configuration

Create a file: `particlePresets.ts`

```typescript
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
  // ============================================
  // LIGHT MODE - Minimal Clean Design
  // ============================================
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
    
    // LIGHT MODE PARTICLE CONFIGURATION
    particles: {
      number: { 
        value: 60,                    // 60 particles on screen
        density: { enable: true, value_area: 700 } 
      },
      color: { value: '#374151' },     // Gray-700 particle color
      opacity: { value: 0.5, random: false },
      size: { value: 2.5, random: true },
      line_linked: { 
        enable: true, 
        distance: 180,                 // Connect particles within 180px
        color: '#6b7280',              // Gray-500 line color
        opacity: 0.35,                 // 35% opacity for lines
        width: 1.2                     // 1.2px line width
      },
      move: { 
        enable: true, 
        speed: 1.2,                    // Slower movement
        direction: 'none', 
        random: false, 
        straight: false, 
        out_mode: 'out' 
      },
    },
    interactivity: {
      events: { 
        onhover: { enable: true, mode: 'grab' },  // Lines connect to mouse
        onclick: { enable: true, mode: 'push' },  // Click to add particles
        resize: true 
      },
      modes: { 
        grab: { 
          distance: 160,                           // Grab lines within 160px
          line_linked: { opacity: 0.6 } 
        }, 
        push: { particles_nb: 3 }                  // Add 3 particles per click
      },
    },
  },

  // ============================================
  // DARK MODE - Cosmic Night Design
  // ============================================
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
    
    // DARK MODE PARTICLE CONFIGURATION
    particles: {
      number: { 
        value: 120,                    // More particles (120) for denser look
        density: { enable: true, value_area: 600 } 
      },
      color: { value: '#e5e7eb' },     // Gray-200 - brighter particles
      opacity: { value: 0.8, random: true },  // More opacity variation
      size: { value: 2, random: true },
      line_linked: { 
        enable: true, 
        distance: 150,                 // Slightly closer connections
        color: '#9ca3af',              // Gray-400 line color
        opacity: 0.5,                  // 50% opacity for visibility
        width: 1                       // 1px line width
      },
      move: { 
        enable: true, 
        speed: 0.8,                    // Even slower, ethereal movement
        direction: 'none', 
        random: true,                  // More randomness
        straight: false, 
        out_mode: 'out' 
      },
    },
    interactivity: {
      events: { 
        onhover: { enable: true, mode: 'grab' }, 
        onclick: { enable: true, mode: 'push' }, 
        resize: true 
      },
      modes: { 
        grab: { 
          distance: 180,                           // Larger grab distance
          line_linked: { opacity: 1 }              // Full opacity on hover
        }, 
        push: { particles_nb: 4 }                  // Add 4 particles per click
      },
    },
  },
};

export type ParticlePresetKey = keyof typeof PARTICLE_PRESETS;
```

---

## 🎨 Step 2: Create the ParticleBackground Component

Create a file: `ParticleBackground.tsx`

```typescript
import React, { useEffect, useRef } from 'react';
import { PARTICLE_PRESETS, ParticlePresetKey } from './particlePresets';

type Props = {
  presetKey: ParticlePresetKey;  // 'light' or 'dark'
  className?: string;
};

export const ParticleBackground: React.FC<Props> = ({ presetKey, className }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    const preset = PARTICLE_PRESETS[presetKey] as any;
    if (!container) return;

    // Clear previous canvas
    container.innerHTML = '';

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return () => undefined;

    // Particle type definition
    type Particle = { 
      x: number;     // X position
      y: number;     // Y position
      vx: number;    // X velocity
      vy: number;    // Y velocity
      r: number      // Radius
    };

    const particles: Particle[] = [];
    
    // Extract configuration from preset
    const count = preset.particles.number.value;
    const linkDistance = preset.particles.line_linked.distance;
    const baseSpeed = preset.particles.move.speed / 2;
    const color = preset.particles.color.value;
    const lineOpacity = preset.particles.line_linked.opacity;
    const lineWidth = preset.particles.line_linked.width;
    const sizeValue = preset.particles.size.value;

    // Mouse tracking for hover interactions
    const mouse = { x: 0, y: 0, active: false };
    const supportsGrab = preset.interactivity.events.onhover.enable && 
                         preset.interactivity.events.onhover.mode === 'grab';
    const grabDistance = preset.interactivity.modes.grab?.distance ?? 140;

    // Create a new particle with random position and velocity
    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = baseSpeed + Math.random() * baseSpeed;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.max(1, sizeValue * (preset.particles.size.random ? Math.random() : 1)),
      };
    };

    // Initialize particles
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    // Event handlers
    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleClick = () => {
      if (!preset.interactivity.events.onclick.enable || 
          preset.interactivity.events.onclick.mode !== 'push') return;
      const toAdd = preset.interactivity.modes.push?.particles_nb ?? 3;
      for (let i = 0; i < toAdd; i++) {
        particles.push(createParticle());
      }
    };

    // Register event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    let frameId = 0;

    // Animation loop
    const step = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges (particles exit one side and enter from opposite)
        if (p.x < -p.r) p.x = canvas.width + p.r; 
        else if (p.x > canvas.width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = canvas.height + p.r; 
        else if (p.y > canvas.height + p.r) p.y = -p.r;

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = preset.particles.opacity.value;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist2 = dx * dx + dy * dy;
          
          // Only connect if distance is less than linkDistance
          if (dist2 < linkDistance * linkDistance) {
            // Calculate opacity based on distance (fade out as particles move apart)
            const opacity = lineOpacity * (1 - Math.sqrt(dist2) / linkDistance);
            if (opacity > 0.01) {
              ctx.beginPath();
              ctx.strokeStyle = color;
              ctx.globalAlpha = opacity;
              ctx.lineWidth = lineWidth;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw lines to mouse cursor on hover (grab effect)
      if (supportsGrab && mouse.active) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < grabDistance) {
            const opacity = Math.max(0, 1 - dist / grabDistance) * lineOpacity;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      frameId = requestAnimationFrame(step);
    };

    step();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      container.innerHTML = '';
    };
  }, [presetKey]);

  return <div ref={canvasRef} className={`absolute inset-0 ${className || ''}`} aria-hidden />;
};
```

---

## 🚀 Step 3: Usage Example

```typescript
import React, { useState } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { PARTICLE_PRESETS } from './components/particlePresets';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const preset = PARTICLE_PRESETS[theme];

  return (
    <div className={`relative min-h-screen ${preset.background}`}>
      {/* Particle Background */}
      <ParticleBackground presetKey={theme} />

      {/* Your Content */}
      <div className="relative z-10">
        <header className={`${preset.headerBg} ${preset.headerText} p-6`}>
          <h1 className="text-3xl font-bold">My Website</h1>
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`mt-4 px-4 py-2 ${preset.buttonPrimary} ${preset.buttonPrimaryText} rounded-lg`}
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </header>

        <main className="p-6">
          <div className={`${preset.cardBg} ${preset.cardText} p-6 rounded-lg max-w-2xl mx-auto`}>
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p className={preset.cardTextMuted}>
              Hover over the background to see the interactive particle effect.
              Click anywhere to add more particles!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
```

---

## 🎨 Color Schemes Breakdown

### Light Mode Colors:
```css
Background: Linear gradient from gray-50 → white → gray-100
Particles: Gray-700 (#374151)
Lines: Gray-500 (#6b7280)
Particle Count: 60
Line Distance: 180px
Line Opacity: 35%
Movement Speed: 1.2 (slower, calmer)
```

### Dark Mode Colors:
```css
Background: Linear gradient from gray-950 → slate-900 → gray-950
Particles: Gray-200 (#e5e7eb) - brighter for contrast
Lines: Gray-400 (#9ca3af)
Particle Count: 120 (denser)
Line Distance: 150px
Line Opacity: 50%
Movement Speed: 0.8 (slower, more ethereal)
```

---

## 🎯 Key Features Explained

### 1. **Particle Movement**
- Particles move with constant velocity in random directions
- When they reach screen edge, they wrap around to the opposite side
- Movement speed is configurable per theme

### 2. **Connecting Lines**
- Lines automatically draw between particles within `linkDistance`
- Line opacity fades based on distance (closer = more visible)
- Uses Pythagorean theorem to calculate distances efficiently

### 3. **Hover Interaction (Grab Mode)**
- When mouse hovers, lines connect from nearby particles to cursor
- Lines fade based on distance from cursor
- Creates an interactive "web" effect

### 4. **Click Interaction (Push Mode)**
- Clicking adds new particles at random positions
- Number of particles added is configurable (3 for light, 4 for dark)

### 5. **Performance Optimization**
- Uses `requestAnimationFrame` for smooth 60fps animation
- Canvas-based rendering (much faster than DOM elements)
- Proper cleanup on component unmount

---

## 🔧 Customization Options

To customize the effect, modify these values in `particlePresets.ts`:

```typescript
particles: {
  number: { value: 60 },           // Number of particles
  color: { value: '#374151' },     // Particle color (hex)
  opacity: { value: 0.5 },         // Particle opacity (0-1)
  size: { value: 2.5 },            // Particle size in pixels
  line_linked: {
    distance: 180,                 // Max distance for lines
    opacity: 0.35,                 // Line opacity (0-1)
    width: 1.2                     // Line thickness
  },
  move: {
    speed: 1.2                     // Movement speed
  }
}
```

---

## 📝 Notes

- The background is **responsive** - automatically adjusts to window resizes
- Uses **CSS gradients** for smooth background colors
- **Backdrop blur effects** on dark mode cards for modern glassmorphism
- All colors use Tailwind CSS classes for consistency
- Performance is excellent even with 120+ particles

---

## 🎉 Result

You now have a beautiful, interactive particle background with:
- ✅ Animated floating particles
- ✅ Dynamic connecting lines
- ✅ Mouse hover interactions
- ✅ Click to add particles
- ✅ Light and dark mode themes
- ✅ Smooth performance
- ✅ Fully customizable

Enjoy your cosmic particle background! 🌌✨
