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
        dark: {
          bg: '#0f172a', // deep navy
          card: '#1e293b', // slate
          text: '#f1f5f9'
        },
        accent: {
          DEFAULT: '#6366f1', // electric indigo
          hover: '#4f46e5',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
