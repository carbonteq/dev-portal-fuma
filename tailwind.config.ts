import type { Config } from 'tailwindcss';

// Astro Starlight color palettes
const accent = { 
  200: '#89d4f8', 
  600: '#007399', 
  900: '#00384c', 
  950: '#002838' 
};

const gray = { 
  100: '#f5f6f8', 
  200: '#eceef2', 
  300: '#c0c2c7', 
  400: '#888b96', 
  500: '#545861', 
  700: '#353841', 
  800: '#24272f', 
  900: '#17181c' 
};

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: { 
        accent, 
        gray 
      },
      fontFamily: {
        'vactory': ['var(--font-vactory)', 'system-ui', 'sans-serif'],
        'kghappy': ['var(--font-kghappy)', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-vactory)', 'system-ui', 'sans-serif'], // Override default sans
      },
    },
  },
  plugins: [],
};

export default config; 