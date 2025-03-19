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
        // 主色调
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        // 基础色调
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
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '-0.01em' }],
        'sm': ['13px', { lineHeight: '18px', letterSpacing: '-0.01em' }],
        'base': ['14px', { lineHeight: '22px', letterSpacing: '-0.01em' }],
        'lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        'xl': ['18px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        '2xl': ['20px', { lineHeight: '30px', letterSpacing: '-0.02em' }],
        '3xl': ['22px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '4xl': ['24px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-xxl)',
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
        'typing': 'typing 2s steps(40, end)',
        'scale-in': 'scaleIn var(--transition-fast) ease-out forwards',
        'scale-out': 'scaleOut var(--transition-fast) ease-in forwards',
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
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.98)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.98)', opacity: '0.8' },
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
      },
      // 新增屏幕断点
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // 新增栅格配置
      gridTemplateColumns: {
        'main': 'minmax(280px, 1fr) minmax(450px, 3fr) minmax(250px, 1fr)',
        'main-md': 'minmax(280px, 1fr) minmax(450px, 3fr)',
        'main-sm': '1fr',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'size': 'height, width',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
}; 