/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#070A13',
          800: '#0D111C',
          700: '#151B2C',
          600: '#1F2942',
        },
        primary: {
          500: '#3B82F6', // Blue
          600: '#2563EB',
        },
        secondary: {
          500: '#6366F1', // Indigo
          600: '#4F46E5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-in': 'slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.4)',
        'glow-indigo': '0 0 15px rgba(99, 102, 241, 0.4)',
        'glow-purple': '0 0 15px rgba(168, 85, 247, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
