# Proposal Builder

A Next.js app that generates a branded two-page sales-proposal PDF with a live preview and one-click download. All content is configured through a left-hand editor form; the PDF previews on the right and updates live.

## What it does

- **Live two-pane editor**: left pane (~420px) edits all proposal fields; right pane renders a live `PDFViewer` preview.
- **Two-page letter-size PDF** via `@react-pdf/renderer` (fully client-side, no backend):
  - Page 1: branded header, full package table, savings/discount strip
  - Page 2: competitor comparison table, hosting cost breakdown, reasons, CTA
- **One-click download**: slugified filename from the company name.
- **Fully configurable**: company name, colors (8 swatches + custom picker), logo upload, line items, competitors, hosting options, copy.

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Works on Vercel out of the box — `npm run build` then deploy. All PDF generation is client-side so no serverless function is needed.

> **Note:** This is a client-only tool. The PDF preview and download use browser APIs exclusively; the app has no server-side data fetching.
