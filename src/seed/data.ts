import type { Home, Suburb } from '@/payload-types'

type SuburbSeed = Pick<
  Suburb,
  'name' | 'slug' | 'city' | 'summary' | 'priceRange' | 'transport' | 'safetyNote' | 'launchStatus'
> & { nearbyHubs: string[] }

export const suburbSeeds: SuburbSeed[] = [
  {
    name: 'Rondebosch',
    slug: 'rondebosch',
    city: 'cape-town',
    summary:
      'Leafy Southern Suburbs streets within reach of UCT, Main Road shops and the Southern Line. A natural first choice for Student Plus groups.',
    priceRange: 'R4,200 – R5,600 per room',
    transport:
      'UCT Jammie Shuttle stops along Main Road, Rondebosch and Rosebank stations on the Southern Line, and MyCiTi-connected taxi routes.',
    safetyNote:
      'Busy, well-lit main roads with private security patrols on many residential streets. Walk in groups after dark and confirm the route from each listing.',
    launchStatus: 'visible',
    nearbyHubs: ['UCT Upper Campus', 'Rondebosch Main Road', 'Cavendish Square'],
  },
  {
    name: 'Observatory',
    slug: 'observatory',
    city: 'cape-town',
    summary:
      'A creative, walkable neighbourhood between the city and UCT, popular with students and young professionals looking for value.',
    priceRange: 'R3,600 – R4,800 per room',
    transport:
      'Observatory station on the Southern Line, short shuttle and taxi trips to UCT and Groote Schuur, and quick access to the N2 and M5.',
    safetyNote:
      'Lively Lower Main Road at night; residential blocks vary street by street. Check security features on each verified listing.',
    launchStatus: 'visible',
    nearbyHubs: ['Groote Schuur Hospital', 'UCT Medical Campus', 'Lower Main Road'],
  },
  {
    name: 'Gardens',
    slug: 'gardens',
    city: 'cape-town',
    summary:
      'Central city living below Table Mountain, walking distance to the CBD, Kloof Street and the Company’s Garden.',
    priceRange: 'R5,200 – R6,800 per room',
    transport:
      'MyCiTi trunk and feeder routes, walkable to the CBD, and short ride-hail trips to the V&A Waterfront and Sea Point.',
    safetyNote:
      'Well-trafficked main streets with CCID public-safety officers nearby. Use building access controls and avoid quiet lanes late at night.',
    launchStatus: 'visible',
    nearbyHubs: ['Cape Town CBD', 'Kloof Street', 'Company’s Garden'],
  },
  {
    name: 'Claremont',
    slug: 'claremont',
    city: 'cape-town',
    summary:
      'A business and retail hub in the Southern Suburbs with offices, Cavendish Square and good rail access — ideal for Young Professionals.',
    priceRange: 'R4,800 – R6,200 per room',
    transport:
      'Claremont station and public transport interchange, Golden Arrow bus routes, and a short drive to UCT and Newlands.',
    safetyNote:
      'Active commercial area with CID patrols around the business district. Residential streets east of Main Road are generally quieter.',
    launchStatus: 'visible',
    nearbyHubs: ['Claremont business district', 'Cavendish Square', 'Newlands'],
  },
  {
    name: 'Stellenbosch Central',
    slug: 'stellenbosch-central',
    city: 'stellenbosch',
    summary:
      'Historic town centre close to Stellenbosch University. Hidden until the first home here is verified.',
    priceRange: 'R4,500 – R6,000 per room',
    transport: 'Walkable to Stellenbosch University and the Stellenbosch station.',
    safetyNote: 'Student-dense town centre with campus security nearby. Verify locally.',
    launchStatus: 'hidden',
    nearbyHubs: ['Stellenbosch University', 'Dorp Street'],
  },
]

type HomeSeed = Pick<
  Home,
  | 'title'
  | 'slug'
  | 'propertyType'
  | 'description'
  | 'roomPrice'
  | 'includedCosts'
  | 'rooms'
  | 'interested'
  | 'groupStatus'
> & {
  suburb: string
  expiresInDays: number
  moveIn: string
  features: string[]
  included: string[]
  image: { url: string; alt: string; palette: [string, string] }
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&h=1067&q=80`

export const homeSeeds: HomeSeed[] = [
  {
    title: 'Rondebosch Garden House',
    slug: 'rondebosch-garden-house',
    suburb: 'rondebosch',
    propertyType: 'house',
    description:
      'A bright five-bedroom family home with a private garden, a large shared kitchen and a quiet study room, a short shuttle ride from UCT Upper Campus.',
    roomPrice: 4300,
    includedCosts: 950,
    rooms: 5,
    interested: 3,
    groupStatus: 'open',
    expiresInDays: 35,
    moveIn: '2027-01-15T12:00:00.000Z',
    features: ['Garden', 'Study room', 'Off-street parking', 'Near UCT shuttle'],
    included: ['Uncapped fibre Wi-Fi', 'Weekly cleaning', 'Security monitoring', 'Water and electricity allowance'],
    image: {
      url: unsplash('photo-1600585154340-be6161a56a0c'),
      alt: 'Modern shared house exterior with a garden in Rondebosch',
      palette: ['#0E2A3B', '#2E6F5E'],
    },
  },
  {
    title: 'Observatory Studio Loft',
    slug: 'observatory-studio-loft',
    suburb: 'observatory',
    propertyType: 'loft',
    description:
      'A converted four-room loft with high ceilings, exposed brick and a rooftop braai area, walking distance to Observatory station and Lower Main Road.',
    roomPrice: 3700,
    includedCosts: 850,
    rooms: 4,
    interested: 3,
    groupStatus: 'almost-full',
    expiresInDays: 18,
    moveIn: '2027-01-01T12:00:00.000Z',
    features: ['Rooftop braai area', 'Walk to station', 'Secure bicycle storage'],
    included: ['Uncapped fibre Wi-Fi', 'Fortnightly cleaning', 'Security monitoring'],
    image: {
      url: unsplash('photo-1502672260266-1c1ef2d93688'),
      alt: 'Open-plan loft living area with large windows in Observatory',
      palette: ['#C2502A', '#0E2A3B'],
    },
  },
  {
    title: 'Gardens Mountain View Flat',
    slug: 'gardens-mountain-view-flat',
    suburb: 'gardens',
    propertyType: 'flat',
    description:
      'A three-bedroom flat with Table Mountain views, a balcony and secure access-controlled parking, a short walk from Kloof Street and the CBD.',
    roomPrice: 5400,
    includedCosts: 1100,
    rooms: 3,
    interested: 1,
    groupStatus: 'open',
    expiresInDays: 42,
    moveIn: '2027-02-01T12:00:00.000Z',
    features: ['Mountain views', 'Balcony', 'Access-controlled parking', 'Walk to CBD'],
    included: ['Uncapped fibre Wi-Fi', 'Weekly cleaning', '24-hour building security', 'Parking bay'],
    image: {
      url: unsplash('photo-1522708323590-d24dbb6b0267'),
      alt: 'Furnished living room in a Gardens flat',
      palette: ['#2E6F5E', '#C6A15B'],
    },
  },
  {
    title: 'Claremont Professional Townhouse',
    slug: 'claremont-professional-townhouse',
    suburb: 'claremont',
    propertyType: 'townhouse',
    description:
      'A modern four-bedroom townhouse in a secure complex with en-suite rooms and backup power, minutes from the Claremont business district.',
    roomPrice: 5100,
    includedCosts: 1000,
    rooms: 4,
    interested: 4,
    groupStatus: 'confirmed',
    expiresInDays: 10,
    moveIn: '2026-12-01T12:00:00.000Z',
    features: ['En-suite rooms', 'Inverter backup power', 'Secure complex', 'Near Claremont station'],
    included: ['Uncapped fibre Wi-Fi', 'Weekly cleaning', 'Complex security', 'Covered parking'],
    image: {
      url: unsplash('photo-1600596542815-ffad4c1539a9'),
      alt: 'Modern townhouse exterior in a secure Claremont complex',
      palette: ['#0E2A3B', '#C6A15B'],
    },
  },
  {
    title: 'Rondebosch Student Residence House',
    slug: 'rondebosch-student-residence-house',
    suburb: 'rondebosch',
    propertyType: 'house',
    description:
      'A six-bedroom house set up for Student Plus groups, with a shared dining room, meal service and dedicated quiet hours during exams.',
    roomPrice: 4100,
    includedCosts: 1900,
    rooms: 6,
    interested: 2,
    groupStatus: 'open',
    expiresInDays: 50,
    moveIn: '2027-02-01T12:00:00.000Z',
    features: ['Meal service', 'Exam quiet hours', 'Laundry room', 'Near UCT shuttle'],
    included: ['Three meals a day', 'Campus transport', 'Uncapped fibre Wi-Fi', 'Weekly cleaning', 'Security monitoring'],
    image: {
      url: unsplash('photo-1560448204-e02f11c3d0e2'),
      alt: 'Shared lounge and dining area in a Rondebosch student house',
      palette: ['#C6A15B', '#2E6F5E'],
    },
  },
  {
    title: 'Observatory Courtyard House',
    slug: 'observatory-courtyard-house',
    suburb: 'observatory',
    propertyType: 'house',
    description:
      'A restored Victorian cottage with a sunny courtyard and five rooms, close to Groote Schuur Hospital — popular with medical students and interns.',
    roomPrice: 3900,
    includedCosts: 900,
    rooms: 5,
    interested: 2,
    groupStatus: 'open',
    expiresInDays: 28,
    moveIn: '2027-01-15T12:00:00.000Z',
    features: ['Courtyard', 'Near Groote Schuur', 'Restored Victorian', 'Secure bicycle storage'],
    included: ['Uncapped fibre Wi-Fi', 'Fortnightly cleaning', 'Security monitoring'],
    image: {
      url: unsplash('photo-1512917774080-9991f1c4c750'),
      alt: 'Restored house with a courtyard in Observatory',
      palette: ['#2E6F5E', '#0E2A3B'],
    },
  },
]
