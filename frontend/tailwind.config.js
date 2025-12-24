/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#E6F4EA', // Светло-зеленый фон
          DEFAULT: '#A8D5BA', // Основной зеленый
          dark: '#6B8E78', // Текст и активные элементы
          text: '#2D3748', // Основной текст
        }
      }
    },
  },
  plugins: [],
}