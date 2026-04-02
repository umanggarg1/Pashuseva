/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Nunito', 'sans-serif'],
      },
      colors: {
        leaf: {
          50:'#f0fdf4', 100:'#dcfce7', 200:'#bbf7d0', 300:'#86efac',
          400:'#4ade80', 500:'#22c55e', 600:'#16a34a', 700:'#15803d',
          800:'#166534', 900:'#14532d',
        },
        earth: {
          50:'#fafaf9',  100:'#f5f5f4', 200:'#e7e5e4', 300:'#d6d3d1',
          400:'#a8a29e', 500:'#78716c', 600:'#57534e', 700:'#44403c',
          800:'#292524', 900:'#1c1917', 950:'#0c0a09',
        },
        gold: {
          50:'#fffbeb', 100:'#fef3c7', 200:'#fde68a', 300:'#fcd34d',
          400:'#fbbf24', 500:'#f59e0b', 600:'#d97706', 700:'#b45309',
          800:'#92400e', 900:'#78350f',
        },
        sand: {
          50:'#fdfcf7',  100:'#f7f3e8', 200:'#ede5cc', 300:'#e0d4ae',
          400:'#cbbd93', 500:'#b8a87a', 600:'#9e8d5f', 700:'#7a6c45',
          800:'#5a4f32', 900:'#3a3220',
        },
        dusk: {
          50:'#f5f4f0',  100:'#e8e5dc', 200:'#cbc5b0', 300:'#a69f87',
          400:'#7c7560', 500:'#5c5644', 600:'#433f30', 700:'#322f24',
          800:'#28261d', 850:'#211f17', 900:'#1a1810', 950:'#13110b',
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-in':   'slideIn 0.3s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { '0%':{ opacity:0, transform:'translateY(20px)' }, '100%':{ opacity:1, transform:'translateY(0)' } },
        fadeIn:    { '0%':{ opacity:0 }, '100%':{ opacity:1 } },
        slideIn:   { '0%':{ transform:'translateX(-10px)', opacity:0 }, '100%':{ transform:'translateX(0)', opacity:1 } },
        pulseSoft: { '0%,100%':{ opacity:1 }, '50%':{ opacity:0.7 } },
      },
    },
  },
  plugins: [],
}
