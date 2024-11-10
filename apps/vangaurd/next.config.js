module.exports = {
  experimental: {
    externalDir: true,
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      use: 'raw-loader',
    });

    return config;
  },
};