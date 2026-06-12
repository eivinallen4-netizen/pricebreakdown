export const DEFAULT_DATA = {
  companyName: 'RED WHITE WELDING',
  subtitle: 'Professional Website Package  |  Las Vegas, NV',
  proposalLabel: 'WEBSITE PROPOSAL',
  preparedFor: 'Prepared for your business',
  intro:
    "A complete, conversion-focused website built to bring you leads — not just a brochure. Here's exactly what you get, and how it stacks up against the Las Vegas market.",
  accent: '#C8102E',
  dark: '#1A1A1A',
  logo: null,
  items: [
    { name: 'Home / Landing Page', value: 200 },
    { name: 'Service Pages', value: 150 },
    { name: 'Call Booking Page', value: 100 },
    { name: 'SEO Setup', value: 100 },
    { name: 'Google Business Profile', value: 75 },
    { name: 'Contact Form Setup', value: 50 },
    { name: 'Mobile Optimization', value: 75 },
    { name: 'Domain Setup', value: 50 },
    { name: 'Graphics / Custom Design', value: 100 },
    { name: 'Website Text (Copywriting)', value: 100 },
    { name: 'Admin Page / CMS', value: 50 },
  ],
  price: 500,
  basePrice: null,
  competitors: [
    {
      type: 'Entry Freelancers',
      price: '$600 – $900',
      gets: '1–3 pages, basic SEO,\ncontact form, mobile-ready',
      vs: "You're LOWER\n+ more included",
    },
    {
      type: 'Small Agencies',
      price: '$1,200 – $2,500',
      gets: '3–6 pages, SEO, booking,\noptimization',
      vs: '40–80% CHEAPER\nsame core features',
    },
    {
      type: 'Subscription Builders',
      price: '$99 – $299 / mo',
      gets: 'Hosting, edits, SEO,\nmaintenance (ongoing)',
      vs: '$1,200–$3,600/yr\nYou pay ONCE',
    },
  ],
  hosting: [
    {
      provider: 'Hostinger (shared)',
      monthly: '$3.99 / mo',
      yearly: '~$48 / yr',
      renewal: 'jumps to $10.99 / mo',
    },
    {
      provider: 'DigitalOcean (server)',
      monthly: '$6 - $48 / mo',
      yearly: '$72 - $576 / yr',
      renewal: 'same, no intro deal',
    },
    {
      provider: 'Vercel Pro (business) *',
      monthly: '$20 / mo',
      yearly: '$240 / yr',
      renewal: '+ usage / traffic fees',
    },
  ],
  hostingNote:
    "* Vercel's free tier is non-commercial only; a real business needs Pro at $20/mo plus traffic-based usage fees. Cheap intro rates renew higher.",
  reasons: [
    {
      title: 'Priced below entry-level',
      desc: 'Under even the cheapest local freelancers - with more built in.',
    },
    {
      title: 'Lead-generating features included',
      desc: 'Booking + service pages are normally $200-$800 add-ons. Included here.',
    },
    {
      title: 'No subscriptions, ever',
      desc: 'Hosting runs $50-$575+ a year, every year. You pay once and own it.',
    },
  ],
  footerNote:
    'Competitor pricing reflects typical Las Vegas / 2026 market ranges and is provided for comparison only.',
}

export function money(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function totalValue(items) {
  return items.reduce((sum, item) => sum + Number(item.value), 0)
}

export function savings(items, price) {
  return totalValue(items) - Number(price)
}

export function discountPct(items, price) {
  const tv = totalValue(items)
  if (!tv) return 0
  return Math.round((savings(items, price) / tv) * 100)
}
