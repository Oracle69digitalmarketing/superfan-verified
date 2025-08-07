/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.cache = false;

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.externals.push({
      "bufferutil": "bufferutil",
      "utf-8-validate": "utf-8-validate",
    });

    return config;
  },
};

module.exports = nextConfig;
