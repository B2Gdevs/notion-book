import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Colorfull',
    short_name: 'Colrofull',
    description: 'Coporate Meal Delivery Daily',
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