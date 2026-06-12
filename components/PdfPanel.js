'use client'

import { useState, useEffect } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import ProposalPDF from './ProposalPDF'

export default function PdfPanel({ data }) {
  const [mounted, setMounted] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Loading…
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <p className="text-sm text-gray-400">PDF preview not loaded</p>
        <button
          onClick={() => setLoaded(true)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: data.accent }}
        >
          Load Preview
        </button>
      </div>
    )
  }

  const filename =
    data.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-proposal.pdf'

  const doc = <ProposalPDF data={data} />

  return (
    <div className="flex flex-col h-full">
      {/* Download bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border-b border-gray-300 shrink-0">
        <PDFDownloadLink
          document={doc}
          fileName={filename}
          style={{
            backgroundColor: data.accent,
            color: 'white',
            padding: '6px 18px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          {({ loading }) => (loading ? 'Preparing…' : 'Download PDF')}
        </PDFDownloadLink>
        <span className="text-xs text-gray-500">{filename}</span>
        <button
          onClick={() => setLoaded(false)}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600 border border-gray-300 rounded px-2 py-1 transition-colors"
        >
          Unload
        </button>
      </div>

      {/* PDF viewer */}
      <div className="flex-1" style={{ minHeight: 0 }}>
        <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
          {doc}
        </PDFViewer>
      </div>
    </div>
  )
}
