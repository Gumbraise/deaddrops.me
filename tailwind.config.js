/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {
      colors: {
        'dd': {
          'dark': {
            'A': '#222133',
            'B': '#26293B',
            'C': '#191E24',
            'D': '#26353B',
            'E': '#213333',
          }
        }
      }
    },
  },
  plugins: [],
}

