'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { DEFAULT_DATA, totalValue, savings, discountPct, money } from '../lib/defaults'
import Editor from '../components/Editor'

const PdfPanel = dynamic(() => import('../components/PdfPanel'), { ssr: false })
const MobileDownload = dynamic(() => import('../components/MobileDownload'), { ssr: false })

export default function ProposalBuilderPage() {
  const [data, setData] = useState(DEFAULT_DATA)
  const [tab, setTab] = useState('edit')

  const tv = totalValue(data.items)
  const sv = savings(data.items, data.price)
  const dp = discountPct(data.items, data.price)

  function handleReset() {
    if (window.confirm('Reset all fields back to defaults?')) setData(DEFAULT_DATA)
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] lg:h-full overflow-hidden">
      {/* Edit pane */}
      <div
        className={[
          'lg:flex lg:w-105 w-full shrink-0 flex-col bg-white h-full border-r border-gray-200 overflow-y-auto',
          tab === 'edit' ? 'flex' : 'hidden',
        ].join(' ')}
      >
        {/* Sticky header */}
        <div className="sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h1 className="text-sm font-bold tracking-tight text-gray-900 truncate pr-2">
              {data.companyName || 'Proposal Builder'}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <MobileDownload data={data} />
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded px-2.5 py-1.5 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          {/* Running totals */}
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100 flex-wrap">
            <span><strong className="text-gray-800">{data.items.length}</strong> items</span>
            <span className="text-gray-300">·</span>
            <span>Value <strong className="text-gray-800">{money(tv)}</strong></span>
            <span className="text-gray-300">·</span>
            <span>Price <strong style={{ color: data.accent }}>{money(data.price)}</strong></span>
            {sv > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <span className="font-semibold text-green-600">Saves {money(sv)} ({dp}%)</span>
              </>
            )}
          </div>
        </div>

        {/* Editor content */}
        <div className="px-4 py-5 flex-1">
          <Editor data={data} setData={setData} />
        </div>
      </div>

      {/* Preview pane */}
      <div
        className={[
          'lg:flex flex-1 bg-gray-200 flex-col h-full',
          tab === 'preview' ? 'flex' : 'hidden',
        ].join(' ')}
      >
        <PdfPanel data={data} />
      </div>

      {/* Mobile tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 flex bg-white border-t border-gray-200 z-50">
        {[
          { key: 'edit', label: 'Edit' },
          { key: 'preview', label: 'Preview PDF' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 py-3 text-sm font-semibold transition-colors"
            style={
              tab === key
                ? { color: data.accent, borderTop: `2px solid ${data.accent}` }
                : { color: '#9CA3AF', borderTop: '2px solid transparent' }
            }
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
