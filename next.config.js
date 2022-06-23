// const webpack = require("webpack");
// const {parsed:envKeys} = require("dotenv").config({path:"./.env"});

// *** disable rewrites for dev
module.exports = {
  baseUrl: process.env.DOMAIN,
  async rewrites() {
    return [
      {
        // source: '/api/:path*',
        source: '/api/:path*',
        destination: `${process.env.DOMAIN}/api/:path*`,
        // destination: `${process.env.DOMAIN}/:path*`,
        // destination: `/:path*`,
      }
    ]
  },
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  // webpack(config){
  //   config.plugins.push(new webpack.EnvironmentPlugin(envKeys))
  //   return config
  // }
}