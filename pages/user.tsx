import { useEffect, useState } from "react";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebaseconfig";
import { useRouter } from "next/router";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<string>("...");
  const [recipes, setRecipes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);

    const fetchData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCredits(docSnap.data().recipeCredits ?? 0);
          const created = docSnap.data().createdAt;
          if (created instanceof Timestamp) {
            setCreatedAt(created.toDate().toLocaleDateString());
          }
        }

        const q = query(
          collection(db, "likedRecipes"),
          where("kullaniciTarifi", "==", true)
        );
        const snapshot = await getDocs(q);
        const userRecipes = snapshot.docs
          .filter((doc) => doc.data().uid === currentUser.uid)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecipes(userRecipes);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async () => {
    if (!confirm("Tüm verileriniz silinecek. Emin misiniz?")) return;
    try {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
        alert("Hesabınız silindi.");
        router.push("/");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Hesap silinemedi. Giriş yapmanız gerekebilir.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Kullanıcı bilgisi alınamadı. Giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-start pt-16 px-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">👤 {user.displayName || "Kullanıcı"}</h1>

      <div className="bg-gray-50 border p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <p className="text-sm text-gray-500 mb-1">{user.email}</p>
        <p className="text-sm text-gray-500 mb-4">Üyelik Tarihi: {createdAt}</p>
        <div className="bg-green-100 text-green-800 font-medium py-2 px-4 rounded-full inline-block shadow">
          Kalan Tarif Hakkınız: {credits ?? "..."} / 5
        </div>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">📋 Tarifleriniz</h2>
        {recipes.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Henüz tarif oluşturmadınız.</p>
        ) : (
          <ul className="space-y-2">
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => router.push(`/tarif/${recipe.id}`)}
              >
                {recipe.title || "Başlıksız Tarif"}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow"
        >
          ← Geri Dön
        </button>
        <button
          onClick={handleDeleteUser}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          🚨 Bilgilerimi Sil
        </button>
      </div>
    </div>
  );
}
