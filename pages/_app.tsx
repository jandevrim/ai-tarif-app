import type { AppProps } from 'next/app';
import '../styles/theme.css'; // Import the global CSS here

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}