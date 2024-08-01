import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ibm8"],
      },
      keyframes: {
        bouncepulse: {
          //red
          "0%": {
            "text-shadow": "0 0 rgb(255 69 58)",
            transform: "rotate(-3deg)",
          },
          "6.25%": { "text-shadow": "rgb(255 69 58)" },
          "12.5%": {
            "text-shadow": ".10em .10em rgb(255 69 58)",
            transform: "rotate(3deg)",
          },
          //orange
          "18.75%": { "text-shadow": "rgb(255 159 10)" },
          "25%": {
            "text-shadow": "0 0 rgb(255 159 10)",
            transform: "rotate(-3deg)",
          },
          "31.25%": { "text-shadow": "rgb(255 159 10)" },
          "37.5%": {
            "text-shadow": ".10em .10em rgb(255 159 10)",
            transform: "rotate(3deg)",
          },
          //yellow
          "43.75%": { "text-shadow": "rgb(255 214 10)" },
          "50%": {
            "text-shadow": "0 0 rgb(255 214 10)",
            transform: "rotate(-3deg)",
          },
          "56.25%": { "text-shadow": "rgb(255 214 10)" },
          "62.5%": {
            "text-shadow": ".10em .10em rgb(255 214 10)",
            transform: "rotate(3deg)",
          },
          //green
          "68.75%": { "text-shadow": "rgb(48 209 88)" },
          "75%": {
            "text-shadow": "0 0 rgb(48 209 88)",
            transform: "rotate(-3deg)",
          },
          "81.25%": { "text-shadow": "rgb(48 209 88)" },
          "87.5%": {
            "text-shadow": ".10em .10em rgb(48 209 88)",
            transform: "rotate(3deg)",
          },
          //blue
          "93.75%": { "text-shadow": "rgb(10 32 255)" },
          "100%": {
            "text-shadow": "0 0 rgb(10 32 255)",
            transform: "rotate(-3deg)",
          },
        },
        colorpulse: {
          //red
          "0%": { "text-shadow": "0 0 rgb(255 69 58)" },
          "6.25%": { "text-shadow": "rgb(255 69 58)" },
          "12.5%": { "text-shadow": ".10em .10em rgb(255 69 58)" },
          //orange
          "18.75%": { "text-shadow": "rgb(255 159 10)" },
          "25%": { "text-shadow": "0 0 rgb(255 159 10)" },
          "31.25%": { "text-shadow": "rgb(255 159 10)" },
          "37.5%": { "text-shadow": ".10em .10em rgb(255 159 10)" },
          //yellow
          "43.75%": { "text-shadow": "rgb(255 214 10)" },
          "50%": { "text-shadow": "0 0 rgb(255 214 10)" },
          "56.25%": { "text-shadow": "rgb(255 214 10)" },
          "62.5%": { "text-shadow": ".10em .10em rgb(255 214 10)" },
          //green
          "68.75%": { "text-shadow": "rgb(48 209 88)" },
          "75%": { "text-shadow": "0 0 rgb(48 209 88)" },
          "81.25%": { "text-shadow": "rgb(48 209 88)" },
          "87.5%": { "text-shadow": ".10em .10em rgb(48 209 88)" },
          //blue
          "93.75%": { "text-shadow": "rgb(10 32 255)" },
          "100%": { "text-shadow": "0 0 rgb(10 32 255)" },
        },
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
        show: {
          "0%": { opacity: "0", visibility: "visible" },
          "100%": { opacity: "100", zIndex: "50" },
        },
        hide: {
          "0%": { opacity: "100" },
          "100%": { opacity: "0", display: "none", zIndex: "-50" },
        },
      },
      animation: {
        bouncepulse: "bouncepulse 12s ease-in-out infinite alternate",
        colorpulse: "colorpulse 6s ease-in-out infinite alternate",
        shake: "shake 1s cubic-bezier(.36,.07,.19,.97) both",
        show: "show 500ms ease forwards",
        hide: "hide 500ms ease forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
