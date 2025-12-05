import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|navbar|divider).js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          500: "#3F4F44",
          800: "#2C3930",
        },
        secondary: {
          100:  "#DCD7C9",
          500: "#A27B5C"
        },
      },
      width: {
        "screen": "100vw",
      },
    },
  },
  plugins: [heroui()],
} satisfies Config;
