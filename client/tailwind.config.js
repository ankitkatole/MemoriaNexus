import daisyui from "daisyui"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: "10px 10px 10px #8400ff, -10px -10px 10px #2e39ff", 
      },
      keyframes: {
        breathe: {
          '0%, 100%': { boxShadow: "10px 10px 20px #8400ff, -10px -10px 20px #2e39ff" }, 
          '50%': { boxShadow: "10px 10px 90px #8400ff, -10px -10px 90px #2e39ff" }, 
        },
      },
      animation: {
        breathe: "breathe 2.8s ease-in-out infinite", 
        'spin-slow': 'spin 5s linear infinite',
        'spin-faster': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [
    daisyui
  ],
}

