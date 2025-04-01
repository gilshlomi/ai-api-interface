/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {},
    },
    safelist: [
      'bg-white',
      'text-gray-900',
      'border-gray-200',
      'text-gray-700',
      'hover:bg-gray-200',
      'bg-gray-100'
    ],
    plugins: [],
  }