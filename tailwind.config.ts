import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        war: { red: '#FF3131', blue: '#00D4FF', gold: '#FFD700', dark: '#0A0A0F', card: '#111118', border: '#1E1E2E' }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'battle-glow': 'battleGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        battleGlow: { from: { boxShadow: '0 0 20px rgba(255,49,49,0.3)' }, to: { boxShadow: '0 0 40px rgba(0,212,255,0.4)' } }
      }
    },
  },
  plugins: [],
};
export default config;
