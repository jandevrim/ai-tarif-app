// ✅ pages/index.tsx – Uygulama başlangıçta landing sayfasına yönlendiriliyor

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/landing");
  }, [router]);

  return null;
}
