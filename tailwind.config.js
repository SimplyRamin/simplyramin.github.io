/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'body': '#0d0d0d',
        'dark-high': '#262626',
        'dark-low': '#404040',
        'light-high': '#737373',
        'light-low': '#a6a6a6',
        'red-high': '#b02929',
        'red-low': '#da5656',
        'green': '#29b067'
      },
      fontFamily: {
        ubuntu: "'Ubuntu', sans-serif",
      }
    },
  },
}
