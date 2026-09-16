/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#009DAE',
          'teal-light': '#E8F7F9',
          'teal-dark': '#008392',
          gold: '#FFAF00',
          'gold-light': '#FFF8E6',
          'gold-dark': '#E59D00',
          pink: '#FF4F6E',
          'pink-light': '#FFF0F3',
          'pink-dark': '#E63D5C',
        },
        teal: {
          50: '#F0FBFD',
          100: '#E0F6FA',
          200: '#BCECF3',
          300: '#8AE0EB',
          400: '#47CFDF',
          500: '#009DAE',
          600: '#008392',
          700: '#006B77',
          800: '#00555E',
          900: '#00424A',
          950: '#00252A',
        },
        gold: {
          50: '#FFFAED',
          100: '#FFF4D6',
          200: '#FFE7A8',
          300: '#FFD770',
          400: '#FFC333',
          500: '#FFAF00',
          600: '#E59D00',
          700: '#BF8300',
          800: '#996900',
          900: '#734E00',
        },
        pink: {
          50: '#FFF1F4',
          100: '#FFE1E7',
          200: '#FFC8D3',
          300: '#FFA4B5',
          400: '#FF7893',
          500: '#FF4F6E',
          600: '#E83D5D',
          700: '#C72443',
          800: '#9E1C35',
          900: '#751427',
        },
        surface: {
          50: '#FAFBFD',
          100: '#F3F5F9',
          200: '#E7ECF3',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'system-ui', '-apple-system', 'sans-serif'],
        roboto: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Roboto', 'Ubuntu', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 157, 174, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 18px 40px -8px rgba(0, 157, 174, 0.14), 0 6px 14px -3px rgba(0, 0, 0, 0.04)',
        'teal-glow': '0 0 25px rgba(0, 157, 174, 0.35)',
        'pink-glow': '0 0 25px rgba(255, 79, 110, 0.35)',
        'gold-glow': '0 0 25px rgba(255, 175, 0, 0.35)',
      }
    },
  },
  plugins: [],
};
