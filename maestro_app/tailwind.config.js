/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        
        // 功能色
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'xxl': 'var(--radius-xxl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      animation: {
        'fade-in': 'fadeIn var(--transition-normal) ease-in-out forwards',
        'slide-up': 'slideUp var(--transition-normal) ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      textColor: {
        // 主要颜色
        'primary': 'rgb(var(--color-primary))',
        'primary-light': 'rgb(var(--color-primary-light))',
        'primary-dark': 'rgb(var(--color-primary-dark))',
        
        // 基础颜色
        'base': 'rgb(var(--color-foreground))',
        'base-70': 'rgba(var(--color-foreground), 0.7)',
        'base-80': 'rgba(var(--color-foreground), 0.8)',
        'base-50': 'rgba(var(--color-foreground), 0.5)',
        
        // 次要文本
        'muted': 'rgb(var(--color-muted))',
        
        // 状态颜色
        'success': 'rgb(var(--color-success))',
        'warning': 'rgb(var(--color-warning))',
        'error': 'rgb(var(--color-error))',
        'info': 'rgb(var(--color-info))',
      },
      backgroundColor: {
        // 主要背景
        'primary': 'rgb(var(--color-primary))',
        'primary-light': 'rgb(var(--color-primary-light))',
        'primary-dark': 'rgb(var(--color-primary-dark))',
        'primary-5': 'rgba(var(--color-primary), 0.05)',
        'primary-10': 'rgba(var(--color-primary), 0.1)',
        'primary-20': 'rgba(var(--color-primary), 0.2)',
        
        // 基础背景
        'base': 'rgb(var(--color-background))',
        'card': 'rgb(var(--color-card))',
        'muted': 'rgba(var(--color-foreground), 0.05)',
        'muted-10': 'rgba(var(--color-foreground), 0.1)',
        
        // 状态背景
        'success': 'rgb(var(--color-success))',
        'success-10': 'rgba(var(--color-success), 0.1)',
        'warning': 'rgb(var(--color-warning))',
        'warning-10': 'rgba(var(--color-warning), 0.1)',
        'error': 'rgb(var(--color-error))',
        'error-10': 'rgba(var(--color-error), 0.1)',
        'info': 'rgb(var(--color-info))',
        'info-10': 'rgba(var(--color-info), 0.1)',
      },
      borderColor: {
        'primary': 'rgb(var(--color-primary))',
        'primary-20': 'rgba(var(--color-primary), 0.2)',
        'primary-30': 'rgba(var(--color-primary), 0.3)',
        'border': 'rgb(var(--color-border))',
        'border-40': 'rgba(var(--color-border), 0.4)',
        'border-60': 'rgba(var(--color-border), 0.6)',
        'error': 'rgb(var(--color-error))',
        'error-20': 'rgba(var(--color-error), 0.2)',
      },
      ringColor: {
        'primary': 'rgb(var(--color-primary))',
      }
    },
  },
  plugins: [],
}; 