/** @type {import('next').NextConfig} */
import process from 'process';
const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL; 
const isDev = process.env.NEXT_PUBLIC_ENV === 'development';
const nextConfig = {
    // Enable standalone output for efficient docker build
    output: 'standalone',
    
    // This proxy is only efficient in development mode
    ...(isDev && {
        async rewrites() {
            return [
                {
                    source: '/api/:path*',
                    destination: `${apiBaseURL}/api/:path*`,
                }
            ];
        }
    })
};

process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
});

export default nextConfig;