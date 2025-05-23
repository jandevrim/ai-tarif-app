"use client";

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, provider } from "../utils/firebaseconfig";
import type { User } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function AuthFooter() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="mt-10 text-center text-sm text-gray-700">
      {user ? (
        <>
          <p>👋 {t("authFooter.welcome", { name: user.displayName || t("authFooter.defaultUser") })}</p>
          <button onClick={handleLogout} className="text-blue-600 underline mt-1">
            {t("authFooter.logout")}
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-white text-gray-800 font-semibold px-6 py-2 mt-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
          {t("authFooter.loginWithGoogle")}
        </button>
      )}
    </div>
  );
}