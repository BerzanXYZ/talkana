import '../styles/globals.css'
import type { AppProps } from 'next/app'
import SolanaProvider from '../contexts/SolanaProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SolanaProvider>
      <Component {...pageProps} />
    </SolanaProvider>
  )
}

export default MyApp
