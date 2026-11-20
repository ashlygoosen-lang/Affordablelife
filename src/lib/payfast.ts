import 'server-only'

import { createHash } from 'node:crypto'
import { promises as dns } from 'node:dns'

/**
 * PayFast "custom integration" helpers.
 * Live mode needs PAYFAST_MODE=live plus PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY and
 * PAYFAST_PASSPHRASE. Without them the public PayFast sandbox account is used.
 */
const SANDBOX = { merchantId: '10000100', merchantKey: '46f0cd694581a', passphrase: 'jt7NOE43FZPn' }

export function payfastConfig() {
  const live = process.env.PAYFAST_MODE === 'live'
  const host = live ? 'www.payfast.co.za' : 'sandbox.payfast.co.za'
  return {
    live,
    merchantId: process.env.PAYFAST_MERCHANT_ID || (live ? '' : SANDBOX.merchantId),
    merchantKey: process.env.PAYFAST_MERCHANT_KEY || (live ? '' : SANDBOX.merchantKey),
    passphrase: process.env.PAYFAST_PASSPHRASE ?? (live ? '' : SANDBOX.passphrase),
    processURL: `https://${host}/eng/process`,
    validateURL: `https://${host}/eng/query/validate`,
  }
}

export const payfastReady = () => {
  const config = payfastConfig()
  return Boolean(config.merchantId && config.merchantKey)
}

/** PayFast encoding: urlencode, spaces as '+', upper-case percent escapes. */
const encode = (value: string) =>
  encodeURIComponent(value.trim())
    .replace(/%20/g, '+')
    .replace(/[!'()*~]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)

export const paramString = (pairs: [string, string][]) =>
  pairs
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([key, value]) => `${key}=${encode(String(value))}`)
    .join('&')

export const signPairs = (pairs: [string, string][], passphrase?: string) => {
  const base = paramString(pairs)
  const withPass = passphrase ? `${base}&passphrase=${encode(passphrase)}` : base
  return createHash('md5').update(withPass).digest('hex')
}

// Field order PayFast uses when it checks the checkout signature.
const CHECKOUT_ORDER = [
  'merchant_id',
  'merchant_key',
  'return_url',
  'cancel_url',
  'notify_url',
  'name_first',
  'name_last',
  'email_address',
  'cell_number',
  'm_payment_id',
  'amount',
  'item_name',
  'item_description',
  'custom_int1',
  'custom_str1',
  'custom_str2',
  'email_confirmation',
  'confirmation_address',
] as const

export type CheckoutInput = {
  invoiceId: string
  amount: number
  itemName: string
  itemDescription?: string
  firstName: string
  lastName?: string
  email: string
  returnURL: string
  cancelURL: string
  notifyURL: string
  token?: string
}

export function buildCheckout(input: CheckoutInput) {
  const config = payfastConfig()
  const values: Record<string, string> = {
    merchant_id: config.merchantId,
    merchant_key: config.merchantKey,
    return_url: input.returnURL,
    cancel_url: input.cancelURL,
    notify_url: input.notifyURL,
    name_first: input.firstName.slice(0, 100),
    name_last: (input.lastName ?? '').slice(0, 100),
    email_address: input.email.slice(0, 100),
    m_payment_id: input.invoiceId,
    amount: input.amount.toFixed(2),
    item_name: input.itemName.slice(0, 100),
    item_description: (input.itemDescription ?? '').slice(0, 255),
    custom_str1: input.token ?? '',
  }
  const pairs = CHECKOUT_ORDER.filter((key) => values[key]).map(
    (key) => [key, values[key]] as [string, string],
  )
  const signature = signPairs(pairs, config.passphrase || undefined)
  return { action: config.processURL, fields: [...pairs, ['signature', signature]] as [string, string][] }
}

const VALID_HOSTS = ['www.payfast.co.za', 'sandbox.payfast.co.za', 'w1w.payfast.co.za', 'w2w.payfast.co.za']

export async function isPayfastIP(ip: string | null) {
  if (process.env.PAYFAST_SKIP_IP_CHECK === 'true') return true
  if (!ip) return false
  const results = await Promise.all(
    VALID_HOSTS.map((host) => dns.lookup(host, { all: true }).catch(() => [])),
  )
  return results.flat().some((entry) => entry.address === ip)
}

/** ITN signatures cover every received field (including empty ones) in received order. */
export const itnParamString = (pairs: [string, string][]) =>
  pairs
    .filter(([key]) => key !== 'signature')
    .map(([key, value]) => `${key}=${encodeURIComponent(value).replace(/%20/g, '+').replace(/[!'()*~]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)}`)
    .join('&')

export function verifyItnSignature(pairs: [string, string][]) {
  const received = pairs.find(([key]) => key === 'signature')?.[1]
  if (!received) return false
  const { passphrase } = payfastConfig()
  const base = itnParamString(pairs)
  const expected = createHash('md5')
    .update(passphrase ? `${base}&passphrase=${encode(passphrase)}` : base)
    .digest('hex')
  return expected === received.toLowerCase()
}

/** Asks PayFast to confirm the notification really came from them. */
export async function confirmWithPayfast(pairs: [string, string][]) {
  if (process.env.PAYFAST_SKIP_VALIDATE === 'true') return true
  const response = await fetch(payfastConfig().validateURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: itnParamString(pairs),
    signal: AbortSignal.timeout(15_000),
  })
  return (await response.text()).trim() === 'VALID'
}
