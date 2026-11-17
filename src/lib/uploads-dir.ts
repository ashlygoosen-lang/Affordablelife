import path from 'path'

/**
 * Root folder for uploaded files. On Railway, mount a volume and point
 * UPLOADS_DIR at it (for example /data/uploads) so files survive redeploys.
 */
export const uploadsDir = (collection: string) =>
  path.resolve(process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads'), collection)
