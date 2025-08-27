/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Note: Roboto is sans; Merriweather is serif
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        serif: ["Merriweather", "ui-serif", "Georgia", "Times New Roman", "serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "540px",
          md: "720px",
          lg: "960px",
          xl: "1140px",
          "2xl": "1320px",
        },
      },
    },
  },
  plugins: [],
};
