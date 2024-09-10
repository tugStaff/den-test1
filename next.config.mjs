import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  //reactStrictMode: true,
  experimental: {
  },
  env: {
    NEXT_PUBLIC_ONESIGNAL_APP_ID: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME,
  },
};

const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);

export default config;