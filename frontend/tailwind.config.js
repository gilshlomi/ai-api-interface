/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/styles/**/*.css",
    ],
    theme: {
      extend: {
        colors: {
          // If you want to use your Intel Blue color palette as proper Tailwind colors
          "intel-blue": {
            primary: "var(--intel-blue-primary)",
            dark: "var(--intel-blue-dark)",
            light: "var(--intel-blue-light)",
            accent: "var(--intel-blue-accent)",
          },
          "intel-gray": {
            light: "var(--intel-gray-light)",
            medium: "var(--intel-gray-medium)",
            dark: "var(--intel-gray-dark)",
          },
        },
      },
    },
    safelist: [
      'text-white',
      'text-gray-900',
      'border-gray-200',
      'text-gray-700',
      'hover:bg-gray-200',
      'bg-gray-100',
      'font-medium',
      'font-semibold',
      'rounded-lg',
      'rounded-t-lg',
      'shadow-sm',
      'transition-colors',
      // Add other classes that are dynamically applied or used in globals.css
    ],
    plugins: [],
  }