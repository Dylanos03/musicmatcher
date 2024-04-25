import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        background: "#1E1E1E",
        foreground: "#EAEAEA",
      },
      animation: {
        "fade-in-bottom": "fade-in-bottom 0.5s ease-out",
      },
      keyframes: {
        "fade-in-bottom": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animationDelay: {
        "0.15s": "0.15s",
        "0.3s": "0.3s",
        "0.45s": "0.45s",
        "0.6s": "0.6s",
        "0.75s": "0.75s",
        "0.9s": "0.9s",
        "1.05s": "1.05s",
        "1.2s": "1.2s",
        "1.35s": "1.35s",
        "1.5s": "1.5s",
      },
    },
    variants: {
      extend: {
        animationDelay: ["responsive"],
      },
    },
  },
  plugins: [],
} satisfies Config;
