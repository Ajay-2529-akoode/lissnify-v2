import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for Elysian
        primary: {
          50: '#FFF8B5',
          100: '#FFF8B5',
          200: '#FFB88C',
          300: '#FFB88C',
          400: '#CD853F',
          500: '#D2691E',
          600: '#8B4513',
          700: '#8B4513',
          800: '#654321',
          900: '#3E2723',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
