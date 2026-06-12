'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { DEFAULT_DATA, totalValue, savings, discountPct, money } from '../lib/defaults'
import Editor from '../components/Editor'

const PdfPanel = dynamic(() => import('../components/PdfPanel'), { ssr: false })
const MobileDownload = dynamic(() => import('../components/MobileDownload'), { ssr: false })

export default function ProposalBuilderPage() {
  const [data, setData] = useState(DEFAULT_DATA)

  const tv = totalValue(data.items)
  const sv = savings(data.items, data.price)
  const dp = discountPct(data.items, data.price)

  function handleReset() {
    if (window.confirm('Reset all fields back to defaults?')) setData(DEFAULT_DATA)
  }

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Left pane: editor */}
      <div className="lg:w-[420px] w-full shrink-0 flex flex-col bg-white overflow-y-auto lg:h-full border-r border-gray-200">
        {/* Sticky header + stats strip */}
        <div className="sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h1 className="text-base font-bold tracking-tight text-gray-900">{data.companyName || 'Proposal Builder'}</h1>
            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <MobileDownload data={data} />
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded px-2.5 py-1 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          {/* Running totals — visible while building the package */}
          <div className="flex items-center gap-3 px-5 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100 flex-wrap">
            <span><strong className="text-gray-800">{data.items.length}</strong> items</span>
            <span className="text-gray-300">·</span>
            <span>Value <strong className="text-gray-800">{money(tv)}</strong></span>
            <span className="text-gray-300">·</span>
            <span>Price <strong style={{ color: data.accent }}>{money(data.price)}</strong></span>
            {sv > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <span className="font-semibold text-green-600">Client saves {money(sv)} ({dp}%)</span>
              </>
            )}
          </div>
        </div>
        <div className="px-5 py-5 flex-1">
          <Editor data={data} setData={setData} />
        </div>
      </div>

      {/* Right pane: PDF preview — desktop only */}
      <div className="hidden lg:flex flex-1 bg-gray-200 flex-col lg:h-full">
        <PdfPanel data={data} />
      </div>
    </div>
  )
}
