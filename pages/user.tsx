import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseconfig";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);

    const fetchCredits = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCredits(docSnap.data().recipeCredits ?? 0);
        }
      }
    };

    fetchCredits();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Kullanıcı bilgisi alınamadı. Giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-start pt-16 px-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">👤 Kullanıcı Sayfası</h1>

      <div className="bg-gray-50 border p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Hoş geldiniz, <span className="text-green-700">{user.displayName || "Kullanıcı"}</span>
        </p>
        <p className="text-sm text-gray-500 mb-4">{user.email}</p>
        <div className="bg-green-100 text-green-800 font-medium py-2 px-4 rounded-full inline-block shadow">
          Kalan Tarif Hakkınız: {credits ?? "..."} / 5
        </div>
      </div>
    </div>
  );
}