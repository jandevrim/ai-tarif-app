import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseconfig"; // ya da doğru yoldan

export async function getUserCredits() {
  const user = getAuth().currentUser;
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().recipeCredits || 0 : null;
}

export async function decrementCredits() {
  const user = getAuth().currentUser;
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    recipeCredits: (await getUserCredits()) - 1,
  });
}