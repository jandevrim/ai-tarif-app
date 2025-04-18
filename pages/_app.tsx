import { useState } from "react"; // ✅ bunu ekle
import '../styles/theme.css'; // Import the global CSS here
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [selectedDevice, setSelectedDevice] = useState<"thermomix" | "thermogusto">("thermomix");

  return <Component {...pageProps} />;
}