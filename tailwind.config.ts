import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "node_modules/@zach.codes/react-calendar/dist/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
