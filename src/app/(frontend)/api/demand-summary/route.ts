import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const suburbSlug = url.searchParams.get('suburb')?.trim()
  if (!suburbSlug) return Response.json({ error: 'Suburb is required.' }, { status: 400 })

  const payload = await getPayload({ config })
  const suburbResult = await payload.find({
    collection: 'suburbs',
    overrideAccess: false,
    depth: 0,
    limit: 1,
    where: { slug: { equals: suburbSlug } },
  })
  const suburb = suburbResult.docs[0]
  if (!suburb) return Response.json({ error: 'Suburb not found.' }, { status: 404 })

  const interests = await payload.find({
    collection: 'demand-interests',
    overrideAccess: true,
    depth: 0,
    limit: 1000,
    select: { roomsRequested: true, status: true },
    where: {
      and: [{ suburb: { equals: suburb.id } }, { status: { not_equals: 'withdrawn' } }],
    },
  })
  const roomsInterested = interests.docs.reduce(
    (total, interest) => total + interest.roomsRequested,
    0,
  )
  const target = 24
  return Response.json(
    {
      roomsInterested,
      target,
      threshold: Math.ceil(target * 0.7),
      reachedPurchaseReview: roomsInterested >= Math.ceil(target * 0.7),
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
