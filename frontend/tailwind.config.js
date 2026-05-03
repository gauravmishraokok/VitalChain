/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#0a0f1e',
          card: 'rgba(15, 25, 50, 0.7)',
        },
        accent: {
          cyan: '#00d4ff',
          green: '#00ff88',
          red: '#ff3355',
          amber: '#ffaa00',
        },
        text: {
          primary: '#e0eaff',
          muted: '#6b7fa3',
        }
      },
      backdropBlur: {
        glass: '16px',
      }
    },
  },
  plugins: [],
}
