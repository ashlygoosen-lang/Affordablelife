const normalise = (value: string) => value.replace(/\/+$/, '')

/**
 * Public origin of the site. On Railway this is derived automatically from the
 * generated domain; set SITE_URL when you attach a custom domain.
 */
export const siteURL = normalise(
  process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : '') ||
    `http://localhost:${process.env.PORT || 3000}`,
)
