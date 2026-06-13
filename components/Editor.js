'use client'

import { useState } from 'react'
import { money, totalValue } from '../lib/defaults'

const SWATCHES = [
  '#C8102E', '#1D4ED8', '#047857', '#B45309',
  '#7C3AED', '#0891B2', '#DB2777', '#111827',
]

const PRESET_CATEGORIES = [
  {
    label: 'Pages',
    items: [
      { name: 'Home / Landing Page', value: 200 },
      { name: 'About Page', value: 75 },
      { name: 'Service Pages', value: 150 },
      { name: 'Portfolio / Gallery', value: 100 },
      { name: 'Blog Section', value: 150 },
      { name: 'FAQ Page', value: 75 },
      { name: 'Call Booking Page', value: 100 },
      { name: 'Privacy Policy / Terms', value: 50 },
    ],
  },
  {
    label: 'Conversion & Leads',
    items: [
      { name: 'Contact Form Setup', value: 50 },
      { name: 'Lead Capture / Popup', value: 75 },
      { name: 'Newsletter Signup', value: 50 },
      { name: 'Live Chat Widget', value: 75 },
      { name: 'Testimonials Section', value: 75 },
      { name: 'Call-to-Action Buttons', value: 50 },
    ],
  },
  {
    label: 'E-Commerce',
    items: [
      { name: 'Online Store (up to 25 products)', value: 400 },
      { name: 'Payment Integration', value: 150 },
      { name: 'Shopping Cart', value: 100 },
      { name: 'Product Pages', value: 200 },
    ],
  },
  {
    label: 'SEO & Marketing',
    items: [
      { name: 'SEO Setup', value: 100 },
      { name: 'Google Analytics Setup', value: 75 },
      { name: 'Google Business Profile', value: 75 },
      { name: 'Social Media Integration', value: 75 },
      { name: 'Schema Markup', value: 75 },
      { name: 'Sitemap & Robots.txt', value: 50 },
    ],
  },
  {
    label: 'Technical',
    items: [
      { name: 'Domain Setup', value: 50 },
      { name: 'Hosting Setup', value: 50 },
      { name: 'SSL Certificate', value: 50 },
      { name: 'Mobile Optimization', value: 75 },
      { name: 'Speed Optimization', value: 75 },
      { name: 'Admin Page / CMS', value: 50 },
      { name: 'ADA Accessibility', value: 100 },
    ],
  },
  {
    label: 'Content & Design',
    items: [
      { name: 'Graphics / Custom Design', value: 100 },
      { name: 'Logo Design', value: 200 },
      { name: 'Website Text (Copywriting)', value: 100 },
      { name: 'Photo Sourcing', value: 75 },
      { name: 'Hero Video / Animation', value: 150 },
    ],
  },
  {
    label: 'Ongoing / Add-ons',
    items: [
      { name: 'Monthly Maintenance', value: 99 },
      { name: 'Business Email Setup', value: 50 },
      { name: 'Site Backups', value: 50 },
      { name: 'Retainer (monthly support)', value: 150 },
    ],
  },
]

const ALL_PRESET_ITEMS = PRESET_CATEGORIES.flatMap(c => c.items)

const PRICE_PRESETS = [299, 399, 499, 599, 749, 999, 1499, 1999, 2499]

const PRESET_COMPETITORS = [
  { type: 'Entry Freelancers', price: '$600 – $900', gets: '1–3 pages, basic SEO,\ncontact form, mobile-ready', vs: "You're LOWER\n+ more included" },
  { type: 'Small Agencies', price: '$1,200 – $2,500', gets: '3–6 pages, SEO, booking,\noptimization', vs: '40–80% CHEAPER\nsame core features' },
  { type: 'Subscription Builders', price: '$99 – $299 / mo', gets: 'Hosting, edits, SEO,\nmaintenance (ongoing)', vs: '$1,200–$3,600/yr\nYou pay ONCE' },
]

const PRESET_HOSTING = [
  { provider: 'Hostinger (shared)', monthly: '$3.99 / mo', yearly: '~$48 / yr', renewal: 'jumps to $10.99 / mo' },
  { provider: 'DigitalOcean (server)', monthly: '$6 - $48 / mo', yearly: '$72 - $576 / yr', renewal: 'same, no intro deal' },
  { provider: 'Vercel Pro (business) *', monthly: '$20 / mo', yearly: '$240 / yr', renewal: '+ usage / traffic fees' },
]

const PRESET_REASONS = [
  { title: 'Priced below entry-level', desc: 'Under even the cheapest local freelancers - with more built in.' },
  { title: 'Lead-generating features included', desc: 'Booking + service pages are normally $200-$800 add-ons. Included here.' },
  { title: 'No subscriptions, ever', desc: 'Hosting runs $50-$575+ a year, every year. You pay once and own it.' },
]

// When the price would exceed total item value, scale every item up proportionally
// so the proposal always shows the client getting a real discount (~40% minimum).
function scaleItemsIfNeeded(newPrice, items) {
  const tv = totalValue(items)
  if (!items.length || newPrice < tv) return items
  const scale = (newPrice * 1.4) / tv
  return items.map(it => ({
    ...it,
    value: Math.max(25, Math.round((it.value * scale) / 25) * 25),
  }))
}

function SectionHead({ label }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3 mt-6 first:mt-0">
      {label}
    </p>
  )
}

function CatHead({ label }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 mt-3 first:mt-0">
      {label}
    </p>
  )
}

function Toggle({ active, accent, onChange, label, sub }) {
  return (
    <button
      role="switch"
      aria-checked={active}
      onClick={onChange}
      className="flex items-center gap-3 w-full py-2.5 text-left"
    >
      <div
        className="w-8 h-[18px] rounded-full flex items-center px-[3px] transition-colors shrink-0"
        style={{ backgroundColor: active ? accent : '#D1D5DB' }}
      >
        <div
          className="w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-150"
          style={{ transform: active ? 'translateX(14px)' : 'translateX(0)' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm leading-snug ${active ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          {label}
        </span>
        {sub && (
          <span className="block text-xs text-gray-400 truncate">{sub}</span>
        )}
      </div>
    </button>
  )
}

export default function Editor({ data, setData }) {
  const [customItemName, setCustomItemName] = useState('')
  const [customItemValue, setCustomItemValue] = useState('')
  const [customPriceMode, setCustomPriceMode] = useState(
    !PRICE_PRESETS.includes(data.price)
  )
  const [discountAmt, setDiscountAmt] = useState(
    data.basePrice && data.basePrice > data.price ? String(data.basePrice - data.price) : ''
  )

  function setField(key, val) {
    setData(d => ({ ...d, [key]: val }))
  }

  function isItemActive(name) {
    return data.items.some(it => it.name === name)
  }

  function toggleItem(preset) {
    setData(d => {
      const active = d.items.some(it => it.name === preset.name)
      if (active) return { ...d, items: d.items.filter(it => it.name !== preset.name) }
      return { ...d, items: [...d.items, preset] }
    })
  }

  function addCustomItem() {
    if (!customItemName.trim()) return
    const val = Number(customItemValue) || 0
    setData(d => ({ ...d, items: [...d.items, { name: customItemName.trim(), value: val }] }))
    setCustomItemName('')
    setCustomItemValue('')
  }

  function removeCustomItem(name) {
    setData(d => ({ ...d, items: d.items.filter(it => it.name !== name) }))
  }

  function isCompetitorActive(type) {
    return data.competitors.some(c => c.type === type)
  }

  function toggleCompetitor(preset) {
    setData(d => {
      const active = d.competitors.some(c => c.type === preset.type)
      if (active) return { ...d, competitors: d.competitors.filter(c => c.type !== preset.type) }
      return { ...d, competitors: [...d.competitors, preset] }
    })
  }

  function isHostingActive(provider) {
    return data.hosting.some(h => h.provider === provider)
  }

  function toggleHosting(preset) {
    setData(d => {
      const active = d.hosting.some(h => h.provider === preset.provider)
      if (active) return { ...d, hosting: d.hosting.filter(h => h.provider !== preset.provider) }
      return { ...d, hosting: [...d.hosting, preset] }
    })
  }

  function isReasonActive(title) {
    return data.reasons.some(r => r.title === title)
  }

  function toggleReason(preset) {
    setData(d => {
      const active = d.reasons.some(r => r.title === preset.title)
      if (active) return { ...d, reasons: d.reasons.filter(r => r.title !== preset.title) }
      return { ...d, reasons: [...d.reasons, preset] }
    })
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setField('logo', ev.target.result)
    reader.readAsDataURL(file)
  }

  const customItems = data.items.filter(
    it => !ALL_PRESET_ITEMS.some(p => p.name === it.name)
  )

  return (
    <div>
      {/* ── Client ───────────────────────────────────────── */}
      <SectionHead label="Client" />

      <div className="space-y-2">
        <input
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300"
          placeholder="Company name"
          value={data.companyName}
          onChange={e => setField('companyName', e.target.value)}
        />
        <input
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300 text-gray-500"
          placeholder="Subtitle (e.g. Professional Website Package | Las Vegas, NV)"
          value={data.subtitle}
          onChange={e => setField('subtitle', e.target.value)}
        />
      </div>

      {/* Accent color */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 mb-1.5">Accent color</p>
        <div className="flex flex-wrap items-center gap-2">
          {SWATCHES.map(c => (
            <button
              key={c}
              title={c}
              onClick={() => setField('accent', c)}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110 shrink-0"
              style={{
                backgroundColor: c,
                boxShadow: data.accent === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : 'none',
              }}
            />
          ))}
          <input
            type="color"
            value={data.accent}
            onChange={e => setField('accent', e.target.value)}
            title="Custom color"
            className="w-7 h-7 rounded-full cursor-pointer border border-gray-200 p-0 overflow-hidden"
          />
        </div>
      </div>

      {/* Logo */}
      <div className="mt-3">
        {data.logo ? (
          <div className="flex items-center gap-3">
            <img src={data.logo} alt="logo" className="h-8 object-contain" />
            <button
              onClick={() => setField('logo', null)}
              className="text-xs text-gray-400 hover:text-red-500 underline"
            >
              Remove logo
            </button>
          </div>
        ) : (
          <label className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
            <span className="border border-dashed border-gray-300 rounded px-3 py-1.5 hover:border-gray-400 transition-colors">
              + Upload logo (optional)
            </span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
          </label>
        )}
      </div>

      {/* Proposal title */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 mb-1.5">Proposal title</p>
        <input
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300"
          placeholder="WEBSITE PROPOSAL"
          value={data.proposalLabel}
          onChange={e => setField('proposalLabel', e.target.value)}
        />
      </div>

      {/* ── Pitch text ───────────────────────────────────── */}
      <SectionHead label="Pitch text" />
      <textarea
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300 text-gray-600"
        rows={4}
        placeholder="Opening paragraph shown at the top of the proposal…"
        value={data.intro}
        onChange={e => setField('intro', e.target.value)}
      />

      {/* ── Package ──────────────────────────────────────── */}
      <SectionHead label="Package" />

      {PRESET_CATEGORIES.map(cat => (
        <div key={cat.label}>
          <CatHead label={cat.label} />
          <div className="grid grid-cols-2 gap-1.5 mb-1">
            {cat.items.map(item => {
              const active = isItemActive(item.name)
              return (
                <button
                  key={item.name}
                  onClick={() => toggleItem(item)}
                  className="flex items-center justify-between px-3 py-2.5 rounded border text-sm text-left transition-all"
                  style={
                    active
                      ? { backgroundColor: data.accent, borderColor: data.accent, color: 'white' }
                      : { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#6B7280' }
                  }
                >
                  <span className="truncate leading-tight">{item.name}</span>
                  <span
                    className="text-xs ml-1.5 shrink-0 font-mono"
                    style={{ opacity: active ? 0.7 : 1 }}
                  >
                    ${item.value}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Custom items already added */}
      <div className="mt-2">
        {customItems.map(it => (
          <div key={it.name} className="flex items-center gap-2 mb-1.5">
            <div
              className="flex-1 flex items-center justify-between px-3 py-2 rounded border text-sm"
              style={{ backgroundColor: data.accent, borderColor: data.accent, color: 'white' }}
            >
              <span>{it.name}</span>
              <span className="text-xs font-mono opacity-70">${it.value}</span>
            </div>
            <button
              onClick={() => removeCustomItem(it.name)}
              className="text-gray-400 hover:text-red-500 text-sm px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add custom item */}
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border border-dashed border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-300"
          placeholder="Custom item…"
          value={customItemName}
          onChange={e => setCustomItemName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustomItem()}
        />
        <input
          type="number"
          className="w-20 border border-dashed border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-300"
          placeholder="$0"
          value={customItemValue}
          onChange={e => setCustomItemValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustomItem()}
        />
        <button
          onClick={addCustomItem}
          className="text-sm text-gray-400 hover:text-gray-700 px-2 border border-dashed border-gray-300 rounded hover:border-gray-400"
        >
          +
        </button>
      </div>

      {/* ── Price ────────────────────────────────────────── */}
      <SectionHead label="Price" />

      <div className="flex flex-wrap gap-2 mb-2">
        {PRICE_PRESETS.map(p => {
          const active = !customPriceMode && data.price === p
          return (
            <button
              key={p}
              onClick={() => {
                setData(d => ({ ...d, price: p, items: scaleItemsIfNeeded(p, d.items), basePrice: null }))
                setCustomPriceMode(false)
                setDiscountAmt('')
              }}
              className="px-4 py-2 rounded border text-sm font-semibold transition-all"
              style={
                active
                  ? { backgroundColor: data.accent, borderColor: data.accent, color: 'white' }
                  : { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#374151' }
              }
            >
              {money(p)}
            </button>
          )
        })}
        <button
          onClick={() => { setCustomPriceMode(true); setDiscountAmt('') }}
          className="px-4 py-2 rounded border text-sm font-semibold transition-all"
          style={
            customPriceMode
              ? { backgroundColor: data.accent, borderColor: data.accent, color: 'white' }
              : { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#374151' }
          }
        >
          Custom
        </button>
      </div>

      {customPriceMode && (
        <input
          type="number"
          autoFocus
          className="border border-gray-200 rounded px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300 mb-2"
          placeholder="Enter price"
          value={data.price}
          onChange={e => setField('price', Number(e.target.value))}
          onBlur={() => setData(d => ({ ...d, items: scaleItemsIfNeeded(d.price, d.items) }))}
        />
      )}

      {/* Discount off total value */}
      <div className="mt-1">
        <p className="text-xs text-gray-400 mb-1.5">
          Discount <span className="text-gray-300">(enter dollar amount — auto-sets price &amp; shows % off)</span>
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">$</span>
            <input
              type="number"
              className="border border-dashed border-gray-300 rounded pl-6 pr-3 py-1.5 text-sm w-36 focus:outline-none focus:border-gray-400 placeholder-gray-300"
              placeholder="e.g. 300"
              value={discountAmt}
              onChange={e => {
                const val = e.target.value
                setDiscountAmt(val)
                if (val === '') {
                  setData(d => ({ ...d, basePrice: null }))
                } else {
                  const discount = Number(val)
                  const tv = totalValue(data.items)
                  setData(d => ({
                    ...d,
                    basePrice: tv,
                    price: Math.max(0, tv - discount),
                  }))
                  setCustomPriceMode(false)
                }
              }}
            />
          </div>
          {discountAmt !== '' && Number(discountAmt) > 0 && (() => {
            const tv = totalValue(data.items)
            const pct = tv > 0 ? Math.round((Number(discountAmt) / tv) * 100) : 0
            const finalPrice = Math.max(0, tv - Number(discountAmt))
            return (
              <>
                <span className="text-xs text-green-600 font-semibold">{pct}% off</span>
                <span className="text-xs text-gray-400">→ {money(finalPrice)}</span>
              </>
            )
          })()}
          {discountAmt !== '' && (
            <button
              onClick={() => {
                setDiscountAmt('')
                setData(d => ({ ...d, basePrice: null }))
              }}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Competitors ──────────────────────────────────── */}
      <SectionHead label="Show competitors" />
      <div className="divide-y divide-gray-100">
        {PRESET_COMPETITORS.map(c => (
          <Toggle
            key={c.type}
            active={isCompetitorActive(c.type)}
            accent={data.accent}
            onChange={() => toggleCompetitor(c)}
            label={c.type}
            sub={c.price}
          />
        ))}
      </div>

      {/* ── Hosting ──────────────────────────────────────── */}
      <SectionHead label="Show hosting options" />
      <div className="divide-y divide-gray-100">
        {PRESET_HOSTING.map(h => (
          <Toggle
            key={h.provider}
            active={isHostingActive(h.provider)}
            accent={data.accent}
            onChange={() => toggleHosting(h)}
            label={h.provider}
            sub={`${h.monthly} · ${h.yearly}`}
          />
        ))}
      </div>

      {/* ── Reasons ──────────────────────────────────────── */}
      <SectionHead label="Selling points" />
      <div className="divide-y divide-gray-100">
        {PRESET_REASONS.map(r => (
          <Toggle
            key={r.title}
            active={isReasonActive(r.title)}
            accent={data.accent}
            onChange={() => toggleReason(r)}
            label={r.title}
            sub={r.desc}
          />
        ))}
      </div>

      <div className="pb-20 lg:pb-8" />
    </div>
  )
}
