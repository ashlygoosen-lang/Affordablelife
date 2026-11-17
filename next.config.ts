import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const siteURL =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : '') ||
  'http://localhost:3000'

const siteHost = (() => {
  try {
    return new URL(siteURL).host
  } catch {
    return undefined
  }
})()

const nextConfig: NextConfig = {
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  poweredByHeader: false,
  images: {
    // Payload serves uploads from /api/<collection>/file/<name>; Next optimises them locally.
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/**' }],
  },
  enablePrerenderSourceMaps: false,
  experimental: {
    cpus: 2,
    globalNotFound: true,
    serverActions: {
      allowedOrigins: siteHost ? [siteHost] : [],
      bodySizeLimit: '12mb',
    },
  },
  env: {
    NEXT_PUBLIC_SITE_URL: siteURL,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
