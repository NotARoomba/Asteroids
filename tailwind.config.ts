import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: { 
      fontFamily: {
        sans: ['ibm8'],
      },
    },
  },
  plugins: [],
} satisfies Config

