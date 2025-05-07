import { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebaseconfig';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
      const gatewaySnapshot = await getDocs(collection(db, 'users'));

      setRecipes(recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setGatewayApprovals(gatewaySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Veriler alınırken hata oluştu:', error);
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => router.push('/'));
  };

  return (
    <div className="p-5">
      <div className="flex justify-between mb-5">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded-lg">Çıkış Yap</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold">Toplam Tarif Sayısı</h2>
          <p>{recipes.length}</p>
        </div>
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold">Kullanıcılar</h2>
          <p>{gatewayApprovals.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
