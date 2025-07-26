import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Timeline',
  description: 'Personal status timeline',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}