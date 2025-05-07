import { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebaseconfig';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';

const AdminPanel = () => {
  const [user, setUser] = useState<null | User>(null);
  const [recipes, setRecipes] = useState<{ id: string; [key: string]: any }[]>([]);
  const [users, setUsers] = useState<{ id: string; [key: string]: any }[]>([]);
  const [view, setView] = useState<'recipes' | 'users' | 'add'>('recipes');
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

  const [newRecipe, setNewRecipe] = useState('');

  const handleAddRecipe = async () => {
    if (!newRecipe) {
      alert('Lütfen geçerli bir JSON girin.');
      return;
    }
    try {
      const parsedRecipe = JSON.parse(newRecipe);
      const docRef = collection(db, 'likedRecipes');
      await addDoc(docRef, parsedRecipe);
      setRecipes(prev => [...prev, { id: docRef.id, ...parsedRecipe }]);
      alert('Tarif başarıyla eklendi.');
      setNewRecipe('');
    } catch (error) {
      console.error('Tarif eklenirken hata oluştu:', error);
      alert('Tarif eklenirken bir hata oluştu. Lütfen kontrol edin.');
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between mb-5 border-b pb-3">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="space-x-4">
          <button onClick={() => setView('add')} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Ekle</button>
          <button onClick={() => setView('recipes')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Tarifler</button>
          <button onClick={() => setView('users')} className="px-4 py-2 bg-green-500 text-white rounded-lg">Kullanıcılar</button>
          <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded-lg">Çıkış Yap</button>
        </div>
      </div>

      {view === 'add' && (
        <div className="mt-5">
          <h2 className="text-lg font-bold mb-2">Yeni Tarif Ekle</h2>
          <textarea
            className="w-full p-2 border rounded-lg mb-2"
            rows={10}
            value={newRecipe}
            onChange={(e) => setNewRecipe(e.target.value)}
            placeholder='{"title": "Tarif Adı", "cihazMarkasi": "Thermomix", "createdAt": {"seconds": 1683401210}, "kullaniciTarifi": true, "tarifDili": "tr"}'
          />
          <button onClick={handleAddRecipe} className="px-4 py-2 bg-green-500 text-white rounded-lg">Kaydet</button>
        </div>
      )}

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
              <tr key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="cursor-pointer hover:bg-gray-100">
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
                <td className="border border-gray-200 p-2">{user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleString() : 'Bilinmiyor'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
