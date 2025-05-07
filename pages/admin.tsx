import { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebaseconfig';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const AdminPanel = () => {
  const [user, setUser] = useState<null | User>(null);
  const [recipes, setRecipes] = useState<{ id: string; [key: string]: any }[]>([]);
  const [gatewayApprovals, setGatewayApprovals] = useState<{ id: string; [key: string]: any }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'jandevrim@gmail.com') {
          setUser(user);
          fetchData();
        } else {
          signOut(auth);
          router.push('/');
        }
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const recipesSnapshot = await getDocs(collection(db, 'likedRecipes'));
      setRecipes(recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Veriler alınırken hata oluştu:', error);
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => router.push('/'));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'likedRecipes', id));
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      alert('Tarif başarıyla silindi.');
    } catch (error) {
      console.error('Tarif silinemedi:', error);
      alert('Tarif silinemedi.');
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between mb-5">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded-lg">Çıkış Yap</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="p-4 border rounded-lg shadow">
            <h2 className="text-lg font-semibold">{recipe.title}</h2>
            <p>Cihaz Markası: {recipe.cihazMarkasi}</p>
            <p>Oluşturulma Tarihi: {new Date(recipe.createdAt.seconds * 1000).toLocaleString()}</p>
            <p>Kullanıcı Tarifi: {recipe.kullaniciTarifi ? 'Evet' : 'Hayır'}</p>
            <p>Tarif Dili: {recipe.tarifDili}</p>
            <button onClick={() => handleDelete(recipe.id)} className="px-4 py-2 mt-2 bg-red-500 text-white rounded-lg">Sil</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
