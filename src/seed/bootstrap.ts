import type { Payload } from 'payload'
import sharp from 'sharp'
import { homeSeeds, suburbSeeds } from './data'

const LOCK_KEY = 4729113

type PgPool = {
  connect: () => Promise<{ query: (sql: string) => Promise<unknown>; release: () => void }>
}

/**
 * Runs once per server start (Payload onInit):
 *  1. creates the first CMS admin from ADMIN_EMAIL / ADMIN_PASSWORD when none exist;
 *  2. seeds launch suburbs and verified homes when the database is empty
 *     (disable with SEED_DEMO_DATA=false).
 * A Postgres advisory lock keeps parallel workers from seeding twice.
 */
export async function bootstrap(payload: Payload) {
  if (process.env.PAYLOAD_SKIP_BOOTSTRAP === 'true') return

  const pool = (payload.db as unknown as { pool?: PgPool }).pool
  const client = pool ? await pool.connect().catch(() => null) : null
  try {
    if (client) {
      const result = (await client.query(`SELECT pg_try_advisory_lock(${LOCK_KEY}) AS locked`)) as {
        rows: { locked: boolean }[]
      }
      if (!result.rows[0]?.locked) return
    }
    await ensureAdmin(payload)
    if (process.env.SEED_DEMO_DATA !== 'false') await seedDemoData(payload)
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Bootstrap failed' })
  } finally {
    if (client) {
      await client.query(`SELECT pg_advisory_unlock(${LOCK_KEY})`).catch(() => undefined)
      client.release()
    }
  }
}

async function ensureAdmin(payload: Payload) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const existing = await payload.count({ collection: 'admins', overrideAccess: true })
  if (existing.totalDocs > 0) return
  if (!email || !password) {
    payload.logger.warn(
      'No CMS admin exists yet. Set ADMIN_EMAIL and ADMIN_PASSWORD, or create one at /admin.',
    )
    return
  }
  await payload.create({
    collection: 'admins',
    overrideAccess: true,
    data: { email, password, name: 'Site administrator' },
  })
  payload.logger.info(`Created CMS admin ${email}`)
}

export async function seedDemoData(payload: Payload, { force = false } = {}) {
  const existing = await payload.count({ collection: 'suburbs', overrideAccess: true })
  if (existing.totalDocs > 0 && !force) return

  payload.logger.info('Seeding launch suburbs and verified homes…')
  const suburbIDs = new Map<string, string>()
  for (const { nearbyHubs, ...suburb } of suburbSeeds) {
    const found = await payload.find({
      collection: 'suburbs',
      overrideAccess: true,
      limit: 1,
      where: { slug: { equals: suburb.slug } },
    })
    const doc =
      found.docs[0] ??
      (await payload.create({
        collection: 'suburbs',
        overrideAccess: true,
        data: { ...suburb, nearbyHubs: nearbyHubs.map((name) => ({ name })) },
      }))
    suburbIDs.set(suburb.slug, String(doc.id))
  }

  const now = Date.now()
  for (const { suburb, expiresInDays, image, features, included, ...home } of homeSeeds) {
    const found = await payload.find({
      collection: 'homes',
      overrideAccess: true,
      limit: 1,
      where: { slug: { equals: home.slug } },
    })
    if (found.docs[0]) continue
    const file = await loadImage(image.url, home.title, image.palette)
    const media = await payload.create({
      collection: 'media',
      overrideAccess: true,
      data: { alt: image.alt },
      file: {
        data: file.data,
        mimetype: file.mimetype,
        name: `${home.slug}.${file.extension}`,
        size: file.data.length,
      },
    })
    await payload.create({
      collection: 'homes',
      overrideAccess: true,
      data: {
        ...home,
        suburb: suburbIDs.get(suburb)!,
        groupExpiry: new Date(now + expiresInDays * 86_400_000).toISOString(),
        coverImage: media.id,
        features: features.map((label) => ({ label })),
        included: included.map((label) => ({ label })),
        verifiedLandlord: true,
        verifiedAddress: true,
        photosChecked: true,
        status: 'verified',
      },
    })
  }
  payload.logger.info('Seed complete.')
}

/** Downloads a stand-in photo; falls back to a generated illustration when offline. */
async function loadImage(url: string, title: string, palette: [string, string]) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    const type = response.headers.get('content-type') ?? ''
    if (response.ok && type.startsWith('image/')) {
      const data = await sharp(Buffer.from(await response.arrayBuffer()))
        .resize(1600, 1067, { fit: 'cover' })
        .jpeg({ quality: 82 })
        .toBuffer()
      return { data, mimetype: 'image/jpeg', extension: 'jpg' }
    }
  } catch {
    // fall through to the generated illustration
  }
  return { data: await illustration(title, palette), mimetype: 'image/jpeg', extension: 'jpg' }
}

function illustration(title: string, [primary, accent]: [string, string]) {
  const safe = title.replace(/[<>&"]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067" viewBox="0 0 1600 1067">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F6F1E9"/><stop offset="1" stop-color="#E9DFD0"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1067" fill="url(#sky)"/>
  <path d="M0 700 L260 430 L470 610 L720 360 L1010 640 L1240 470 L1600 720 L1600 1067 L0 1067 Z" fill="${primary}" opacity="0.16"/>
  <rect x="0" y="820" width="1600" height="247" fill="${accent}" opacity="0.22"/>
  <g transform="translate(520 380)">
    <polygon points="280,0 600,230 -40,230" fill="${primary}"/>
    <rect x="0" y="230" width="560" height="320" fill="#FBFAF7"/>
    <rect x="240" y="370" width="90" height="180" rx="8" fill="${accent}"/>
    <rect x="60" y="290" width="120" height="100" rx="8" fill="${primary}" opacity="0.85"/>
    <rect x="390" y="290" width="120" height="100" rx="8" fill="${primary}" opacity="0.85"/>
    <rect x="60" y="420" width="120" height="90" rx="8" fill="${primary}" opacity="0.55"/>
    <rect x="390" y="420" width="120" height="90" rx="8" fill="${primary}" opacity="0.55"/>
  </g>
  <text x="1520" y="1020" text-anchor="end" font-family="Arial, sans-serif" font-size="24" fill="${primary}" opacity="0.55">${safe} · stand-in illustration</text>
</svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer()
}
