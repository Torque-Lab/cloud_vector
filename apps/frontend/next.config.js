/** @type {import('next').NextConfig} */
import process from 'process';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL; 
const isDev = process.env.NEXT_PUBLIC_ENV === 'development';

const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, "../../"),

  ...(isDev && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${apiBaseURL}/api/:path*`,
        }
      ];
    },
  }),
};

process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
});

export default nextConfig;
