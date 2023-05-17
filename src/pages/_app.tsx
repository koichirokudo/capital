import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import Spinner from 'components/Spinner'
import { AuthContextProvider } from 'contexts/AuthContext'
import SpinnerContextProvider from 'contexts/SpinnerContext'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import { ApiContext } from 'types'
import { fetcher } from 'utils/axios'
import createEmotionCache from '../createEmotionCache'
import theme from '../theme'

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
        >
          <SpinnerContextProvider>
            <AuthContextProvider context={context}>
              <Spinner />
              <Component {...pageProps} />
            </AuthContextProvider>
          </SpinnerContextProvider>
        </SWRConfig>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default CapitalApp
