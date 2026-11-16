/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.js"],
  theme: {
    extend: {
      colors: {
        'body': '#0d0d0d',
        'panel': '#121212',
        'line': '#232323',
        'dark-high': '#262626',
        'dark-low': '#404040',
        'light-high': '#737373',
        'muted': '#8b8b8b',
        'light-low': '#a6a6a6',
        'soft': '#d4d4d4',
        'red-high': '#b02929',
        'red-low': '#da5656',
        'green': '#29b067',
        'bright': '#fefefe'
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      maxWidth: {
        'page': '72rem',
      },
    },
  },
}
