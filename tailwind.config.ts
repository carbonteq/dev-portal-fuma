import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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