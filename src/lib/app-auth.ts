import 'server-only'

import config from '@payload-config'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

const SESSION_COOKIE = 'app-session'

export function createAppAuth() {
  return {
    async currentUser(): Promise<User | null> {
      const token = (await cookies()).get(SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayload({ config })
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })
      if (!user || user.collection !== 'users' || user.status === 'suspended') return null
      return user
    },

    async login(email: string, password: string): Promise<User> {
      const payload = await getPayload({ config })
      const result = await payload.login({
        collection: 'users',
        overrideAccess: false,
        data: { email, password },
      })
      if (!result.token || !result.user) throw new Error('Login failed')

      const maxAge = result.exp
        ? Math.max(60, result.exp - Math.floor(Date.now() / 1000))
        : 60 * 60 * 24 * 7
      ;(await cookies()).set(SESSION_COOKIE, result.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge,
      })
      return result.user
    },

    async logout() {
      ;(await cookies()).delete(SESSION_COOKIE)
    },
  }
}

export const appAuth = createAppAuth()
