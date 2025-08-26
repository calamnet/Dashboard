/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Merriweather', 'sans-serif'], // default sans-serif font
        serif: ['Roboto', 'sans-serif'], // default sans-serif font
      }
    },
  },
  plugins: [],
}

module.exports = {
  theme: {
    extend: {},
    container: {
      center: true,
      padding: '1rem', // ~16px padding like Bootstrap's container
      screens: {
        sm: '540px',   // Bootstrap sm
        md: '720px',   // Bootstrap md
        lg: '960px',   // Bootstrap lg
        xl: '1140px',  // Bootstrap xl
        '2xl': '1320px' // Bootstrap xxl
      },
    },
  },
  plugins: [],
}