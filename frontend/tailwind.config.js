/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        marfil: '#FDFBF8',
        'gris-piedra': '#3E3D3A',
        oliva: '#8C8A63',
        terracota: '#C36A2D',
        'beige-arena': '#E3C9A8',
      },
    },
  },
  plugins: [],
};
