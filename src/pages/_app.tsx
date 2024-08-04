import { ErrorBoundary } from '@/components/Error/error-boundary'
import { fallbackRender } from '@/components/Error/fallback-render'
import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Head>
        <title>{`Brazuerao Apostas - ${new Date().getFullYear()}`}</title>
        <meta name="description" content="Republica TDT - Brazuerão Apostas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
