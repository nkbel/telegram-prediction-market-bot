/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A6CF7',
          light: '#6C8AFF',
          dark: '#3A5CE8',
        },
        text: {
          primary: '#1A2B5F',
          secondary: '#64748B',
          light: '#94A3B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F5F8FF',
          hover: '#E8F0FF',
        },
        accent: {
          yes: {
            from: '#4A6CF7',
            to: '#6C8AFF',
          },
          no: {
            from: '#FF6B6B',
            to: '#FF8E8E',
          },
        },
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '10px',
        modal: '20px',
      },
      boxShadow: {
        'blue-sm': '0 2px 8px rgba(74, 108, 247, 0.08)',
        'blue-md': '0 4px 12px rgba(74, 108, 247, 0.08)',
        'blue-lg': '0 8px 24px rgba(74, 108, 247, 0.12)',
        'blue-hover': '0 6px 20px rgba(74, 108, 247, 0.15)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}

