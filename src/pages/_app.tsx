import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../theme'
import createEmotionCache from '../createEmotionCache'
import SpinnerContextProvider from 'contexts/SpinnerContext'
import { AuthContextProvider } from 'contexts/AuthContext'
import { ApiContext } from 'types'
import { SWRConfig } from 'swr'
import { fetcher } from 'utils'
import Spinner from 'components/Spinner'

const clientSideEmotionCache = createEmotionCache()
interface CapitalAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

const CapitalApp = (props: CapitalAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta key="charset" name="charset" content="utf-8" />
        <meta
          key="viewport"
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:type" content="website" />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SWRConfig
          value={{
            shouldRetryOnError: false,
            fetcher,
          }}
        />
        <SpinnerContextProvider>
          <AuthContextProvider context={context}>
            <Spinner />
            <Component {...pageProps} />
          </AuthContextProvider>
        </SpinnerContextProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default CapitalApp
