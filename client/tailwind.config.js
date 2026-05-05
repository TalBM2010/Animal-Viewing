/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', '"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        jungle: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        sunshine: {
          400: '#facc15',
          500: '#eab308',
        },
        sky2: {
          400: '#38bdf8',
          500: '#0ea5e9',
        },
      },
      keyframes: {
        'projector-in': {
          '0%': { opacity: '0', transform: 'translateY(-30px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'reticle-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'flash-white': {
          '0%': { opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        'projector-in': 'projector-in 480ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'reticle-pulse': 'reticle-pulse 2.4s ease-in-out infinite',
        'flash-white': 'flash-white 320ms ease-out forwards',
        'toast-in': 'toast-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        wobble: 'wobble 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
