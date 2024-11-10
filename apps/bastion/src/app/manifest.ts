import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Colorfull Bastion App',
    short_name: 'Colrofull - Bastion',
    description: 'The Admin app for colorfull drivers and partners.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/Logo_Green_192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/Logo_Green_512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}