import { useState } from "react"; // ✅ bunu ekle
import '../styles/theme.css'; // Import the global CSS here
import type { AppProps } from "next/app";
import '../utils/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '../utils/i18n';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [selectedDevice, setSelectedDevice] = useState<"thermomix" | "thermogusto">("thermomix");

  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nextProvider>
  );
}