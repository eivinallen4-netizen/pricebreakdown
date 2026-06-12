import './globals.css'

export const metadata = {
  title: 'Proposal Builder',
  description: 'Generate branded sales proposal PDFs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
