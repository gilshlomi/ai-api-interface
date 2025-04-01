/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}", // This will include all files in the src directory
    ],
    theme: {
      extend: {
        // Your custom theme extensions
      },
    },
    safelist: [
      'bg-white', // Explicitly safelist bg-white
    ],
    plugins: [],
  }