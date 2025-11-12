// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#7E3F98', 
        'brand-pink': '#E62A86',
        'icon-bg': '#E9E1F8',
        'icon-fill': '#89489C',
        'countdown-bg': '#374151',
        'light-gray': '#F9FAFB',
        'countdown-container': '#EAE2F8',
        'brand-cyan': '#00D1FF',
        'login-button': '#A13CBF',
         'placeholder-purple': '#8E28AA', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}