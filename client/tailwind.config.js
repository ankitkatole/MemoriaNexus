/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: "10px 10px 10px #8400ff, -10px -10px 10px #2e39ff", // green and cyan shadow
      },
      keyframes: {
        breathe: {
          '0%, 100%': { boxShadow: "10px 10px 20px #8400ff, -10px -10px 20px #2e39ff" }, // Full intensity
          '50%': { boxShadow: "10px 10px 90px #8400ff, -10px -10px 90px #2e39ff" }, // Larger blur radius at 50%
        },
      },
      animation: {
        breathe: "breathe 2.8s ease-in-out infinite", // Breathing animation over 3 seconds, infinite loop
      },
    },
  },
  plugins: [],
}

