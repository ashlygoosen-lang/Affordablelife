import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Affordable Life',
    short_name: 'Affordable Life',
    description: 'Personal accommodation, business offices and corporate space solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F1E9',
    theme_color: '#0E2A3B',
    icons: [{ src: '/affordable-life-mark.png', sizes: '512x512', type: 'image/png' }],
  }
}
