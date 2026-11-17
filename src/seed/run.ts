/**
 * Manual seed: `pnpm seed` (add `-- --force` to re-run when data already exists).
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { seedDemoData } from './bootstrap'

const payload = await getPayload({ config })
await seedDemoData(payload, { force: process.argv.includes('--force') })
process.exit(0)
