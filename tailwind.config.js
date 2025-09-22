/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        sunrise: '#ff9f1c',
        sky: '#8ecae6',
        lagoon: '#219ebc',
        midnight: '#023047',
        leaf: '#90be6d',
        peach: '#ffd166',
        blush: '#ffb6b9',
        cream: '#fff7e6',
        'soft-gray': '#f3f4f6',
      },
      fontFamily: {
        display: ['"Fredoka"', '"Baloo 2"', '"Trebuchet MS"', '"Comic Sans MS"', 'sans-serif'],
        body: ['"Nunito"', '"Avenir"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 32px rgba(2, 48, 71, 0.12)',
        pop: '0 20px 40px rgba(255, 159, 28, 0.25)',
      },
      borderRadius: {
        hero: '28px',
        badge: '999px',
      },
      transitionTimingFunction: {
        snappy: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        soft: 'cubic-bezier(0.16, 0.68, 0.43, 0.99)',
      },
    },
  },
  plugins: [],
}
