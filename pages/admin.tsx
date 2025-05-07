import { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebaseconfig';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const AdminPanel = () => {
  const [user, setUser] = useState<null | User>(null);
  const [recipes, setRecipes] = useState<{ id: string; [key: string]: any }[]>([]);
  const [users, setUsers] = useState<{ id: string; [key: string]: any }[]>([]);
  const [view, setView] = useState<'recipes' | 'users'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
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
      const usersSnapshot = await getDocs(collection(db, 'users'));

      setRecipes(recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      <div className="flex justify-between mb-5 border-b pb-3">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="space-x-4">
          <button onClick={() => setView('recipes')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Tarifler</button>
          <button onClick={() => setView('users')} className="px-4 py-2 bg-green-500 text-white rounded-lg">Kullanıcılar</button>
          <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded-lg">Çıkış Yap</button>
        </div>
      </div>

      {view === 'recipes' && (
        <table className="min-w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2">Title</th>
              <th className="border border-gray-200 p-2">Cihaz Markası</th>
              <th className="border border-gray-200 p-2">Oluşturulma Tarihi</th>
              <th className="border border-gray-200 p-2">Kullanıcı Tarifi</th>
              <th className="border border-gray-200 p-2">Tarif Dili</th>
              <th className="border border-gray-200 p-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td onClick={() => setSelectedRecipe(recipe)} className="border border-gray-200 p-2 cursor-pointer hover:bg-gray-100">{recipe.title}</td>
                <td className="border border-gray-200 p-2">{recipe.cihazMarkasi}</td>
                <td className="border border-gray-200 p-2">{new Date(recipe.createdAt.seconds * 1000).toLocaleString()}</td>
                <td className="border border-gray-200 p-2">{recipe.kullaniciTarifi ? 'Evet' : 'Hayır'}</td>
                <td className="border border-gray-200 p-2">{recipe.tarifDili}</td>
                <td className="border border-gray-200 p-2">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(recipe.id); }} className="px-2 py-1 bg-red-500 text-white rounded">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {view === 'users' && (
        <table className="min-w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2">Kullanıcı Adı</th>
              <th className="border border-gray-200 p-2">Email</th>
              <th className="border border-gray-200 p-2">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-200 p-2">{user.displayName || 'Bilinmiyor'}</td>
                <td className="border border-gray-200 p-2">{user.email}</td>
                <td className="border border-gray-200 p-2">{new Date(user.createdAt.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
