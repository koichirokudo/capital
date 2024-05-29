import createEmotionServer from '@emotion/server/create-instance'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps as NextDocumentInitialProps,
} from 'next/document'
import { AppProps as NextAppProps, AppType } from 'next/app'
import createEmotionCache from '../createEmotionCache'
import theme from '../theme'
import { EmotionCache } from '@emotion/react'
import React from 'react'

interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache
}

interface DocumentInitialProps extends NextDocumentInitialProps {
  emotionStyleTags?: React.ReactElement[]
}

export default class MyDocument extends Document {
  render() {
    const { emotionStyleTags } = this.props as DocumentInitialProps

    return (
      <Html lang="ja">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap%22%20rel=%22stylesheet"
          />
          {emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: AppType) =>
        function EnhanceApp(props: AppProps) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags,
  }
}
