/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#e6f3f3", // Very light misty green
          100: "#b3e0e0", // Light misty green
          300: "#4a9999", // Medium misty teal
          500: "#2c5e5e", // Deep forest teal
          700: "#1c3d3d", // Dark forest green
          900: "#0a1a1a", // Almost black forest green
        },
        mist: {
          100: "#d1d5db", // Light misty gray
          300: "#9ca3af", // Medium misty gray
          500: "#6b7280", // Dark misty gray
          700: "#374151", // Very dark misty gray
        },
      },
      backgroundImage: {
        "forest-gradient":
          "linear-gradient(to bottom right, #1c3d3d, #0a1a1a, #2c5e5e)",
      },
      boxShadow: {
        "forest-soft": "0 10px 25px rgba(12, 32, 32, 0.25)",
        "forest-glow": "0 0 15px rgba(64, 192, 192, 0.2)",
      },
      transitionProperty: {
        forest: "background-color, border-color, color, transform, opacity",
      },
      borderRadius: {
        "forest-lg": "1rem", // Slightly more rounded corners
      },
      animation: {
        "forest-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
}
