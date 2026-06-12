'use client'

import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ProposalPDF from './ProposalPDF'

export default function MobileDownload({ data }) {
  const [preparing, setPreparing] = useState(false)

  const filename =
    data.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-proposal.pdf'

  if (!preparing) {
    return (
      <button
        onClick={() => setPreparing(true)}
        className="text-xs font-semibold text-white px-3 py-1.5 rounded transition-colors"
        style={{ backgroundColor: data.accent }}
      >
        Download PDF
      </button>
    )
  }

  return (
    <PDFDownloadLink
      document={<ProposalPDF data={data} />}
      fileName={filename}
      style={{
        backgroundColor: data.accent,
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        padding: '6px 12px',
        borderRadius: '4px',
        textDecoration: 'none',
        display: 'inline-block',
      }}
    >
      {({ loading }) => (loading ? 'Preparing…' : 'Download PDF')}
    </PDFDownloadLink>
  )
}
