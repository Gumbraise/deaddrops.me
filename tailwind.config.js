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
            'A': '#080808',
            'B': '#26293B',
            'C': '#000000',
            'D': '#191919',
            'E': '#213333',
          }
        }
      },
      height: {
        'screen-dvh': '100dvh',
      },
      maxHeight: {
        'screen-dvh': '100dvh',
      },
    },
  },
  plugins: [],
}

