import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function CreditSticker() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCredits(userSnap.data().recipeCredits || 0);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (credits === null) return null;

  return (
    <div className="fixed top-4 right-4 bg-yellow-200 border border-yellow-500 text-yellow-800 px-4 py-2 rounded-full shadow-lg text-lg font-semibold z-50 animate-bounce">
      🌟 {credits} Kredi
    </div>
  );
}