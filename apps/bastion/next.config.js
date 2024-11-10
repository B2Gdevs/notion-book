// next.config.js
const MyWebpackPlugin = require('./my-webpack-plugin');

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
        pathname: '/account123/**',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.html$/,
        use: 'raw-loader',
      });
    }

    if (isServer && dev) {
      config.plugins.push(new MyWebpackPlugin());
    }

    return config;
  },
};
