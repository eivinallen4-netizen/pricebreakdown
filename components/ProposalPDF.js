import React from 'react'
import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
import { money, totalValue, savings, discountPct } from '../lib/defaults'

// Auto-generate the "vs. your price" column text based on actual price.
// Keeps the comparison honest — no "you're cheaper" claim when you're not.
function competitorVs(type, price) {
  const p = Number(price)
  switch (type) {
    case 'Entry Freelancers': {
      if (p < 600) return "You're LOWER\n+ more included"
      if (p <= 1000) return "Same price range\n2× the deliverables"
      return "Full-scope package\nvs. basic 1–3 pages"
    }
    case 'Small Agencies': {
      if (p < 1200) {
        const pct = Math.round((1 - p / 1850) * 100)
        return `${pct}% below agencies\nsame core features`
      }
      if (p <= 2500) return 'Agency-level scope\nno agency markup'
      return 'Premium package\ncustomized deliverables'
    }
    case 'Subscription Builders': {
      const midYearly = 199 * 12
      if (p <= midYearly / 2) return '$1,200–$3,600/yr\nYou pay ONCE'
      const yrs = (p / midYearly).toFixed(1)
      return `Breaks even in ~${yrs} yrs\nno ongoing fees`
    }
    default:
      return ''
  }
}

function lighten(hex, amt) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amt)
  const g = Math.min(255, ((num >> 8) & 0xff) + amt)
  const b = Math.min(255, (num & 0xff) + amt)
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

function SectionTitle({ label, accent }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 13, color: '#1A1A1A' }}>{label}</Text>
      <View style={{ height: 2, backgroundColor: accent, marginTop: 3 }} />
    </View>
  )
}

function MultiLineText({ text, style }) {
  const lines = String(text).split('\n')
  return (
    <View>
      {lines.map((line, i) => (
        <Text key={i} style={style}>{line}</Text>
      ))}
    </View>
  )
}

export default function ProposalPDF({ data }) {
  const {
    companyName, subtitle, proposalLabel, preparedFor, intro,
    accent, dark, logo, items, price, basePrice, competitors, hosting,
    hostingNote, reasons, footerNote,
  } = data

  const tv = totalValue(items)
  const sv = savings(items, price)
  const dp = discountPct(items, price)
  const hasAnchor = basePrice && Number(basePrice) > Number(price)
  const anchorSave = hasAnchor ? Number(basePrice) - Number(price) : 0
  const anchorPct = hasAnchor ? Math.round((anchorSave / Number(basePrice)) * 100) : 0
  const dividerColor = lighten(accent, 70)
  const noteColor = lighten(accent, 90)

  const base = { fontFamily: 'Helvetica', fontSize: 10, color: dark }
  const bold = { fontFamily: 'Helvetica-Bold' }
  const oblique = { fontFamily: 'Helvetica-Oblique' }

  const tableHeaderCell = {
    ...bold, fontSize: 10.5, color: 'white',
    paddingVertical: 7, paddingHorizontal: 8,
  }
  const cellBase = {
    fontSize: 8.5,
    paddingVertical: 6, paddingHorizontal: 8,
  }

  return (
    <Document>
      {/* ── PAGE 1 ───────────────────────────────────────────── */}
      <Page size="LETTER" style={base}>
        {/* Header band */}
        <View style={{ backgroundColor: dark }}>
          {/* Accent stripe — top */}
          <View style={{ height: 7, backgroundColor: accent }} />
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
            paddingHorizontal: 28, paddingTop: 14, paddingBottom: 18,
          }}>
            {/* Left */}
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {logo ? (
                <Image src={logo} style={{ height: 40, objectFit: 'contain', objectPositionX: 'left' }} />
              ) : (
                <Text style={{ ...bold, fontSize: 22, color: 'white' }}>{companyName}</Text>
              )}
              <Text style={{ fontSize: 10.5, color: '#BFBFBF', marginTop: 6 }}>{subtitle}</Text>
            </View>
            {/* Right */}
            <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ ...bold, fontSize: 11, color: accent }}>{proposalLabel}</Text>
              <Text style={{ fontSize: 9, color: '#BFBFBF', marginTop: 3, textAlign: 'right' }}>Prepared for {companyName}</Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={{ paddingHorizontal: 28, paddingTop: 18 }}>
          {/* Intro */}
          <Text style={{ color: '#6B6B6B', fontSize: 10.5, lineHeight: 1.35, marginBottom: 16 }}>
            {intro}
          </Text>

          {/* Package section title */}
          <SectionTitle label="Your Package — Everything Included" accent={accent} />

          {/* Table header */}
          <View style={{ flexDirection: 'row', backgroundColor: dark }}>
            <Text style={{ ...tableHeaderCell, flex: 3 }}>Deliverable</Text>
            <Text style={{ ...tableHeaderCell, flex: 1, textAlign: 'right' }}>Value</Text>
          </View>

          {/* Item rows */}
          {items.map((item, i) => (
            <View key={i} style={{
              flexDirection: 'row',
              backgroundColor: i % 2 === 0 ? 'white' : '#FAFAFA',
              borderBottomWidth: 0.5,
              borderBottomColor: '#E0E0E0',
            }}>
              <Text style={{ ...cellBase, flex: 3 }}>{item.name}</Text>
              <Text style={{ ...cellBase, flex: 1, textAlign: 'right' }}>{money(item.value)}</Text>
            </View>
          ))}

          {/* Total value row */}
          <View style={{ flexDirection: 'row', backgroundColor: '#F4F4F4' }}>
            <Text style={{ ...cellBase, ...bold, fontSize: 11.5, flex: 3 }}>Total Value</Text>
            <Text style={{ ...cellBase, ...bold, fontSize: 11.5, flex: 1, textAlign: 'right' }}>{money(tv)}</Text>
          </View>

          {/* Savings strip */}
          <View style={{
            marginTop: 14, borderRadius: 8, backgroundColor: accent,
            flexDirection: 'row', paddingVertical: 16,
          }}>
            {/* LIST PRICE anchor — only shown when basePrice is set */}
            {hasAnchor && (
              <>
                <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 8, justifyContent: 'center' }}>
                  <Text style={{ ...bold, color: 'white', fontSize: 8, marginBottom: 4, letterSpacing: 0.5, opacity: 0.7 }}>LIST PRICE</Text>
                  <Text style={{ ...bold, color: 'white', fontSize: 22, textDecoration: 'line-through', opacity: 0.55 }}>{money(basePrice)}</Text>
                </View>
                <View style={{ width: 0.75, backgroundColor: dividerColor, marginVertical: 6 }} />
              </>
            )}

            {/* YOUR PRICE */}
            <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 10 }}>
              <Text style={{ ...bold, color: 'white', fontSize: 8, marginBottom: 3, letterSpacing: 0.5 }}>YOUR PRICE</Text>
              <Text style={{ ...bold, color: 'white', fontSize: 28 }}>{money(price)}</Text>
              <Text style={{ ...oblique, color: noteColor, fontSize: 8.5, marginTop: 5, textAlign: 'center', lineHeight: 1.3 }}>
                {'One-time cost. No monthly fees.\nNo subscription lock-in.'}
              </Text>
            </View>

            {/* Divider */}
            <View style={{ width: 0.75, backgroundColor: dividerColor, marginVertical: 6 }} />

            {/* YOU SAVE — from anchor if set, otherwise from item values */}
            <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center' }}>
              <Text style={{ ...bold, color: 'white', fontSize: 8, marginBottom: 3, letterSpacing: 0.5 }}>YOU SAVE</Text>
              <Text style={{ ...bold, color: 'white', fontSize: 28 }}>{money(hasAnchor ? anchorSave : sv)}</Text>
            </View>

            {/* Divider */}
            <View style={{ width: 0.75, backgroundColor: dividerColor, marginVertical: 6 }} />

            {/* DISCOUNT */}
            <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center' }}>
              <Text style={{ ...bold, color: 'white', fontSize: 8, marginBottom: 3, letterSpacing: 0.5 }}>DISCOUNT</Text>
              <Text style={{ ...bold, color: 'white', fontSize: 28 }}>{hasAnchor ? anchorPct : dp}%</Text>
            </View>
          </View>
        </View>

        {/* Fixed footer p1 */}
        <Text style={{
          position: 'absolute', bottom: 15, left: 0, right: 0,
          textAlign: 'center', color: '#999', fontSize: 8,
        }}>
          {companyName}  •  Website Proposal  •  Page 1 of 2
        </Text>
      </Page>

      {/* ── PAGE 2 ───────────────────────────────────────────── */}
      <Page size="LETTER" style={base}>
        {/* Header band */}
        <View style={{ backgroundColor: dark }}>
          <View style={{ paddingHorizontal: 28, paddingTop: 16, paddingBottom: 14 }}>
            <Text style={{ ...bold, fontSize: 16, color: 'white' }}>
              How {money(price)} Compares — Market
            </Text>
          </View>
          {/* Accent stripe — bottom */}
          <View style={{ height: 7, backgroundColor: accent }} />
        </View>

        {/* Body */}
        <View style={{ paddingHorizontal: 28, paddingTop: 14 }}>
          {/* Comparison intro */}
          <Text style={{ color: '#6B6B6B', fontSize: 10, marginBottom: 8 }}>
            What other providers charge for a comparable small-business site:
          </Text>

          {/* Comparison table header */}
          <View style={{ flexDirection: 'row', backgroundColor: dark }}>
            <Text style={{ ...bold, fontSize: 9.5, color: 'white', flex: 1.55, paddingVertical: 7, paddingHorizontal: 7 }}>Provider Type</Text>
            <Text style={{ ...bold, fontSize: 9.5, color: 'white', flex: 1.35, paddingVertical: 7, paddingHorizontal: 7 }}>Typical Price</Text>
            <Text style={{ ...bold, fontSize: 9.5, color: 'white', flex: 2.35, paddingVertical: 7, paddingHorizontal: 7 }}>What You Get</Text>
            <Text style={{ ...bold, fontSize: 9.5, color: 'white', flex: 1.55, paddingVertical: 7, paddingHorizontal: 7 }}>vs. {money(price)}</Text>
          </View>

          {/* Competitor rows */}
          {competitors.map((c, i) => (
            <View key={i} style={{ flexDirection: 'row', backgroundColor: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
              <View style={{ flex: 1.55, paddingVertical: 6, paddingHorizontal: 7 }}>
                <Text style={{ ...bold, fontSize: 8.5 }}>{c.type}</Text>
              </View>
              <View style={{ flex: 1.35, paddingVertical: 6, paddingHorizontal: 7 }}>
                <Text style={{ fontSize: 8.5 }}>{c.price}</Text>
              </View>
              <View style={{ flex: 2.35, paddingVertical: 6, paddingHorizontal: 7 }}>
                <MultiLineText text={c.gets} style={{ fontSize: 8.5 }} />
              </View>
              <View style={{ flex: 1.55, paddingVertical: 6, paddingHorizontal: 7 }}>
                <MultiLineText text={competitorVs(c.type, price)} style={{ ...bold, fontSize: 8.5, color: '#1F8A45' }} />
              </View>
            </View>
          ))}

          {/* Company row */}
          <View style={{ flexDirection: 'row', backgroundColor: accent }}>
            <Text style={{ ...bold, fontSize: 8.5, color: 'white', flex: 1.55, paddingVertical: 7, paddingHorizontal: 7 }}>
              {companyName}
            </Text>
            <Text style={{ fontSize: 8.5, color: 'white', flex: 1.35, paddingVertical: 7, paddingHorizontal: 7 }}>
              {money(price)} one-time
            </Text>
            <Text style={{ fontSize: 8.5, color: 'white', flex: 2.35, paddingVertical: 7, paddingHorizontal: 7 }}>
              {items.length} deliverables, booking + service pages, copywriting
            </Text>
            <Text style={{ ...bold, fontSize: 8.5, color: 'white', flex: 1.55, paddingVertical: 7, paddingHorizontal: 7 }}>
              BEST VALUE
            </Text>
          </View>

          {/* Hosting section */}
          <View style={{ marginTop: 14 }}>
            <SectionTitle label="What Hosting Actually Costs (Per Year, Forever)" accent={accent} />
          </View>

          {/* Hosting table header */}
          <View style={{ flexDirection: 'row', backgroundColor: dark }}>
            <Text style={{ ...bold, fontSize: 9, color: 'white', flex: 1.95, paddingVertical: 6, paddingHorizontal: 7 }}>Hosting Provider</Text>
            <Text style={{ ...bold, fontSize: 9, color: 'white', flex: 1.35, paddingVertical: 6, paddingHorizontal: 7, textAlign: 'right' }}>Monthly</Text>
            <Text style={{ ...bold, fontSize: 9, color: 'white', flex: 1.55, paddingVertical: 6, paddingHorizontal: 7, textAlign: 'right' }}>Per Year</Text>
            <Text style={{ ...bold, fontSize: 9, color: 'white', flex: 1.95, paddingVertical: 6, paddingHorizontal: 7, textAlign: 'right' }}>Renewal Rate</Text>
          </View>

          {/* Hosting rows */}
          {hosting.map((h, i) => (
            <View key={i} style={{ flexDirection: 'row', backgroundColor: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
              <Text style={{ ...bold, fontSize: 8.5, flex: 1.95, paddingVertical: 6, paddingHorizontal: 7 }}>{h.provider}</Text>
              <Text style={{ fontSize: 8.5, flex: 1.35, paddingVertical: 6, paddingHorizontal: 7, textAlign: 'right' }}>{h.monthly}</Text>
              <Text style={{ ...bold, fontSize: 8.5, color: accent, flex: 1.55, paddingVertical: 6, paddingHorizontal: 7, textAlign: 'right' }}>{h.yearly}</Text>
              <Text style={{ fontSize: 8.5, flex: 1.95, paddingVertical: 6, paddingHorizontal: 7, textAlign: 'right' }}>{h.renewal}</Text>
            </View>
          ))}

          {/* Hosting note */}
          <Text style={{ ...oblique, fontSize: 7.5, color: '#6B6B6B', marginTop: 5, marginBottom: 12 }}>
            {hostingNote}
          </Text>

          {/* Reasons section */}
          <SectionTitle label="Why This Is the Obvious Choice" accent={accent} />
          {reasons.map((r, i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 7 }}>
              <Text style={{ color: accent, ...bold, fontSize: 11, marginRight: 7, lineHeight: 1.2 }}>+</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ ...bold, fontSize: 10.5 }}>{r.title}</Text>
                <Text style={{ color: '#6B6B6B', fontSize: 9.5, marginTop: 1 }}>{r.desc}</Text>
              </View>
            </View>
          ))}

          {/* CTA box */}
          <View style={{
            marginTop: 12, backgroundColor: dark, borderRadius: 8,
            paddingVertical: 20, paddingHorizontal: 24,
          }}>
            <Text style={{ ...bold, fontSize: 13, color: 'white', textAlign: 'center' }}>
              Complete professional website — {money(price)}, one time.
            </Text>
            <Text style={{ fontSize: 10, color: '#BFBFBF', textAlign: 'center', marginTop: 6 }}>
              Save {money(sv)} vs. the package value. Save thousands vs. the competition.
            </Text>
          </View>
        </View>

        {/* Fixed footer p2 */}
        <View style={{ position: 'absolute', bottom: 15, left: 28, right: 28 }}>
          <Text style={{ textAlign: 'center', color: '#999', fontSize: 8, marginBottom: 4 }}>
            {companyName}  •  Website Proposal  •  Page 2 of 2
          </Text>
          <Text style={{ ...oblique, textAlign: 'center', color: '#6B6B6B', fontSize: 7 }}>
            {footerNote}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
