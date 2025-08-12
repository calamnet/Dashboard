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