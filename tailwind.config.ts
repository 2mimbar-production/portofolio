import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palet etalase (dari moodboard): navy, bata, kobalt, langit, pasir.
        navy: { DEFAULT: "#082756", 700: "#163A72" },
        bata: { DEFAULT: "#B65243", 600: "#9C4234", 50: "#FBEDEA" },
        kobalt: { DEFAULT: "#275996", 50: "#EAF1FA" },
        langit: { DEFAULT: "#6FA2E3", 100: "#DCE9F8", 50: "#EFF5FC" },
        pasir: { DEFAULT: "#CCBAAC", 100: "#EFE7E0", 50: "#F7F2EC" },
        kanvas: "#FCF9F5",
        redup: "#5A6984",
      },
      fontFamily: {
        // Satu keluarga font — Inter — di semua tempat. Beda "display" / "sans"
        // / "mono" sekarang cuma beda gaya (weight, tracking), bukan beda
        // typeface. Lihat .font-display & .font-mono di globals.css.
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        signature: "18px 18px 18px 4px", // sudut asimetris — elemen signature kartu
        mega: "40px", // sudut sangat melengkung — hero & gallery card baru di Home
      },
    },
  },
  plugins: [],
};
export default config;
