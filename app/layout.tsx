import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Peach UP',
  description: 'Kit Moletom Infantil Menina Inverno',
  metadataBase: new URL('https://aromasnotino.shop'),
  alternates: {
    canonical: '/',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif" }}>{children}</body>
    </html>
  )
}
