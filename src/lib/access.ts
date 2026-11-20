import type { Access, FieldAccess, PayloadRequest } from 'payload'

type AppUser = { collection?: string; id?: string | number; role?: string | null }

export const userOf = (req: PayloadRequest) => req.user as AppUser | null | undefined

export const isStaff = (req: PayloadRequest) => userOf(req)?.collection === 'admins'
export const isMember = (req: PayloadRequest) => userOf(req)?.collection === 'users'
export const isPartner = (req: PayloadRequest) =>
  isMember(req) && userOf(req)?.role === 'partner'

export const adminOnly: Access = ({ req }) => isStaff(req)
export const adminField: FieldAccess = ({ req }) => isStaff(req)
export const nobody: FieldAccess = () => false
