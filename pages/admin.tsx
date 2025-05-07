import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [gatewayApprovals, setGatewayApprovals] = useState([]);
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

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
      const recipesSnapshot = await getDocs(collection(db, 'recipes'));
      const gatewaySnapshot = await getDocs(collection(db, 'gatewayApprovals'));

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
        <Button onClick={handleSignOut}>Çıkış Yap</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Toplam Tarif Sayısı</h2>
            <p>{recipes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Onay Bekleyen Gateway İşlemleri</h2>
            <p>{gatewayApprovals.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
