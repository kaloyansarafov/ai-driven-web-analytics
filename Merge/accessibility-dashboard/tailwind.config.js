module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Extended blue color for primary
        blue: {
          50: "#e6f1ff",
          100: "#cce3ff",
          200: "#99c8ff",
          300: "#66acff",
          400: "#3390ff",
          500: "#0074ff",
          600: "#005ecc",
          700: "#004799",
          800: "#002f66",
          900: "#001833",
        },
        // Darker shades for dark mode
        gray: {
          750: "#1f2733",
          850: "#151d29",
          950: "#0b1016",
        },
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      maxHeight: {
        0: "0",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        full: "100%",
      },
      opacity: {
        15: "0.15",
        35: "0.35",
        85: "0.85",
      },
      // Add custom transitions for better animations
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      // Add shadows specifically designed for dark mode
      boxShadow: {
        "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
        dark: "0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.6)",
        "dark-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.6)",
        "dark-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.6)",
        "dark-xl":
          "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
        "dark-2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
        "dark-inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)",
      },
      // Add custom animation for skeleton loading
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
