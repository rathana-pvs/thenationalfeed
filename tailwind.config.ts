import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bbc-red': 'var(--bbc-red)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        quiet: 'var(--quiet)',
        line: 'var(--line)',
        'soft-line': 'var(--soft-line)',
        surface: 'var(--surface)',
        white: 'var(--white)',
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-card': 'var(--bg-card)',
        'bg-hover': 'var(--bg-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-gold': 'var(--accent-gold)',
        'accent-red': 'var(--accent-red)',
        'accent-red-bright': 'var(--accent-red-bright)',
        'accent-blue': 'var(--accent-blue)',
        border: 'var(--border)',
        'border-subtle': 'var(--border-subtle)',
      },
      fontFamily: {
        display: ['Georgia', '"Times New Roman"', 'serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        'source-serif': ['Georgia', '"Times New Roman"', 'serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        mono: ['monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--ink)',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '18px',
            lineHeight: '1.8',
          },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-pause': 'marquee 30s linear infinite paused',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-dot': 'pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
