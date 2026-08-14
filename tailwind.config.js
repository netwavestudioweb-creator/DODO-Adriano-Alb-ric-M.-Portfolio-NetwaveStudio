/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C1C1E",
        coral: "#E8634A",
        "coral-hover": "#D8533A",
        "coral-soft": "#F3D9D2",
        snow: "#FAFAFA",
        "snow-2": "#F1EFEC",
        graphite: "#2D2D2D",
        "graphite-muted": "#6E6E73",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        '2rem': '2rem',
        '2.5rem': '2.5rem',
        '3rem': '3rem',
      },
      boxShadow: {
        'card': '0 8px 30px rgba(28, 28, 30, 0.06)',
        'card-hover': '0 20px 40px rgba(28, 28, 30, 0.12)',
        'coral-glow': '0 10px 30px rgba(232, 99, 74, 0.25)',
      }
    },
  },
  plugins: [],
}
