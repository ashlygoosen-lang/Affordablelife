import localFont from 'next/font/local'

// Self-hosted (SIL Open Font License) so builds never depend on Google Fonts.
export const inter = localFont({
  src: [
    { path: './fonts/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: './fonts/inter-latin-wght-italic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-inter',
  display: 'swap',
})
export const fraunces = localFont({
  src: [
    { path: './fonts/fraunces-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: './fonts/fraunces-latin-wght-italic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
})
