import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, getFirestore } from "firebase/firestore";
import { app, db } from "./firebase";

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

export async function ensureUserInFirestore(user: any) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email || "",
      displayName: user.displayName || "",
      recipeCredits: 5,
    });
  }
}

export async function getUserRecipeCredits(): Promise<number> {
  const user = getAuth().currentUser;
  if (!user) return 0;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().recipeCredits || 0 : 0;
}