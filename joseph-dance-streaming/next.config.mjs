const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.mux.com' }
    ]
  }
};

export default nextConfig;