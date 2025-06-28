// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@700&family=Inter:wght@400&display=swap"
            rel="stylesheet"
          />
		  <link rel="stylesheet" href="/theme.css" /> 
 {/* Google Ads gtag.js */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-1032120347"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-1032120347');
            `,
          }}
        />


      </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}