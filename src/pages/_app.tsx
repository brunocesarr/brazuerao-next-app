import { fallbackRender } from '@/components/Error/fallback-render'
import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ErrorBoundary } from 'react-error-boundary'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{`Brazuerao Apostas - ${new Date().getFullYear()}`}</title>
        <meta name="description" content="Republica TDT - Brazuerão Apostas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <ErrorBoundary fallbackRender={fallbackRender}>
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  )
}
