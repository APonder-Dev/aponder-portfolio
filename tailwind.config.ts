import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        dark: {
          50:  '#f1f5f9',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#0a0f1e',
          950: '#030712',
        },
      },
      animation: {
        'glow-pulse':      'glow-pulse 2.5s ease-in-out infinite',
        'float':           'float 5s ease-in-out infinite',
        'blink':           'blink 1s step-end infinite',
        'gradient-shift':  'gradient-shift 5s ease infinite',
        'scan':            'scan 3s linear infinite',
        'status-pulse':    'status-pulse 2s ease-in-out infinite',
        'fade-in-up':      'fade-in-up 0.6s ease forwards',
        'slide-in-right':  'slide-in-right 0.6s ease forwards',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(59,130,246,0.2)' },
          '50%':       { boxShadow: '0 0 35px rgba(59,130,246,0.55), 0 0 60px rgba(59,130,246,0.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'gradient-shift': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'scan': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'status-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.8)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  safelist: [
    // Footer BMC hover
    'hover:text-yellow-400',
    'hover:bg-yellow-400/10',
    'hover:border-yellow-400/20',
    // Skills bar gradients (patterns work for non-variant classes)
    { pattern: /^from-(blue|emerald|indigo|purple|cyan)-(400|500)$/ },
    { pattern: /^to-(blue|emerald|indigo|purple|cyan)-(400|500)$/ },
    // Skills card hover borders (variants must be listed explicitly)
    'hover:border-blue-500/40',
    'hover:border-emerald-500/40',
    'hover:border-indigo-500/40',
    'hover:border-purple-500/40',
    'hover:border-cyan-500/40',
    // Skills icon group-hover colors
    'group-hover:text-blue-400',
    'group-hover:text-emerald-400',
    'group-hover:text-indigo-400',
    'group-hover:text-purple-400',
    'group-hover:text-cyan-400',
  ],
  plugins: [],
}

export default config
