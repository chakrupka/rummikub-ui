/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-blue-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-black",
    "hover:bg-blue-400",
    "hover:bg-yellow-400",
    "hover:bg-red-400",
    "hover:bg-gray-500",
    "text-blue-500",
    "text-yellow-500",
    "text-red-500",
    "text-black",
  ],
  theme: { extend: {} },
  plugins: [],
};
