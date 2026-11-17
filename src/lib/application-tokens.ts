import { createHash, randomBytes } from 'node:crypto'

export const createResumeToken = () => randomBytes(32).toString('base64url')

export const hashResumeToken = (token: string) => createHash('sha256').update(token).digest('hex')

export const isResumeToken = (value: unknown): value is string =>
  typeof value === 'string' && value.length >= 32 && value.length <= 128
