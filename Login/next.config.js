/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar eslint y typecheck durante build
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configuración para CORS
  async headers() {
    return [
      {
        // Aplicar estas cabeceras a todas las rutas
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Configuración para permitir conexiones a dominios externos
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig