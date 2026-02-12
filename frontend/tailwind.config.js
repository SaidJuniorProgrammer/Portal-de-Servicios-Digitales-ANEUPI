/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aneupi: {
          primary: '#0c476b',    // Azul oscuro institucional
          secondary: '#1a6b9e',  // Azul medio
          accent: '#e0f2fe',     // Azul muy claro
          text: '#1e293b',       // Texto
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}