import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ThemeScriptTag } from 'use-theme-switcher';
 
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
        </Head>
        <body>
          <ThemeScriptTag
            defaultDarkTheme="theme-dark" 
            defaultLightTheme="theme-light"
            themeStorageKey='blog__theme'
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}