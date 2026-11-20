import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sharpTransformer } from '@payloadcms/transformer-sharp'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Homes } from './collections/Homes'
import { PropertySubmissions } from './collections/PropertySubmissions'
import { Suburbs } from './collections/Suburbs'
import { DemandInterests } from './collections/DemandInterests'
import { ApplicationDocuments } from './collections/ApplicationDocuments'
import { TenantApplications } from './collections/TenantApplications'
import { Users } from './collections/Users'
import { Tenancies } from './collections/Tenancies'
import { Invoices } from './collections/Invoices'
import { Payments } from './collections/Payments'
import { MaintenanceRequests } from './collections/MaintenanceRequests'
import { Payouts } from './collections/Payouts'
import { PaymentSettings } from './globals/PaymentSettings'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { migrations } from './migrations'
import { bootstrap } from './seed/bootstrap'
import { siteURL } from './lib/site-url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURL = process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL || ''

// Railway's private Postgres network does not use TLS; its public proxy URL does.
const useSSL =
  process.env.DATABASE_SSL === 'true' ||
  (process.env.DATABASE_SSL !== 'false' && /proxy\.rlwy\.net|sslmode=require/.test(databaseURL))

export default buildConfig({
  // serverURL is intentionally unset so upload URLs stay relative (/api/media/file/...),
  // which next/image can optimise without remotePatterns on any domain.
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Admins.slug,
    autoRefresh: true,
    constrainWidth: true,
    meta: {
      titleSuffix: ' · Affordable Life Admin',
    },
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['/components/admin/ops-link#OpsLink'],
    },
  },
  // Outgoing email (invoices, receipts, password resets) once SMTP is configured.
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM || 'hello@affordablelife.co.za',
          defaultFromName: 'Affordable Life',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_PORT === '465',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          },
        }),
      }
    : {}),
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  collections: [
    Admins,
    Users,
    Media,
    Folders,
    Tags,
    Suburbs,
    Homes,
    DemandInterests,
    TenantApplications,
    ApplicationDocuments,
    PropertySubmissions,
    Tenancies,
    Invoices,
    Payments,
    MaintenanceRequests,
    Payouts,
  ],
  globals: [PaymentSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    idType: 'uuid',
    pool: {
      connectionString: databaseURL,
      ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    // Development keeps the schema in sync automatically; production applies
    // the committed migrations in src/migrations on startup.
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DISABLE_PUSH !== 'true',
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  upload: {
    transformers: [sharpTransformer()],
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  csrf: [siteURL].filter(Boolean),
  cors: [siteURL].filter(Boolean),
  onInit: bootstrap,
})
