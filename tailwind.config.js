module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-bg': "url('/home-1.jpg')",
      },
      colors: {
        glass: "rgba(0, 0, 0, 0.123)",
      }
    },
  },
  plugins: [],
}