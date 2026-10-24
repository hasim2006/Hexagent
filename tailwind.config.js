/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050507',
          900: '#0a0a0f',
          800: '#101018',
          700: '#16161f',
          600: '#1d1d28',
        },
        ember: {
          50: '#fff5ed',
          100: '#ffe8d4',
          200: '#ffcca8',
          300: '#ffa871',
          400: '#ff8a3d',
          500: '#ff6a00',
          600: '#e85a00',
          700: '#bf4700',
          800: '#8f3500',
          900: '#5e2300',
        },
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff00d4',
          lime: '#a3ff00',
          violet: '#9d4eff',
          amber: '#ffb800',
          rose: '#ff3366',
          blue: '#0080ff',
          green: '#00ff88',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.4em',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-med': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
        'spin-rev': 'spin-rev 18s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'rise': 'rise 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'drift': 'drift 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'spin-rev': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.5', filter: 'blur(8px)' },
          '50%': { opacity: '1', filter: 'blur(14px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
