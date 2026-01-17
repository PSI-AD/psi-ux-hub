/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        surface: 'var(--bg-surface)',
        border: 'var(--border-color)',
        primary: {
          DEFAULT: '#3B82F6', // Google Blue
          hover: '#2563EB',
        },
        // Legacy support (mapping to new system)
        'psi-gold': '#3B82F6', // Replaced with Blue
        'obsidian': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        luxury: ['Inter', 'sans-serif'], // Forced override
        mono: ['monospace'], // Simple mono
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}

