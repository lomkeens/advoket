/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F46E5', // Indigo-600 light variant
          DEFAULT: '#4338CA', // Indigo-700
          dark: '#3730A3', // Indigo-800
        },
        secondary: {
          light: '#0EA5E9', // Sky-500 light variant
          DEFAULT: '#0284C7', // Sky-600
          dark: '#0369A1', // Sky-700
        },
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}