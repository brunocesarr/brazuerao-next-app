import type { Metadata } from 'next'
import { ErrorBoundary } from '@/components/Error/error-boundary'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: `Brazuerao Apostas - ${new Date().getFullYear()}`,
  description: 'Republica TDT - Brazuerão Apostas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-lt-installed="true">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
