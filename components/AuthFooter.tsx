// Shared imports
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from "../utils/firebaseconfig";

// Common Login UI
function AuthFooter() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
      await auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="text-center py-6 text-sm text-gray-600">
      {user ? (
        <div>
          <p>👋 Hoş geldin, {user.displayName || "Kullanıcı"}</p>
          <button onClick={handleLogout} className="text-blue-600 underline mt-1">Çıkış Yap</button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-white text-gray-800 font-semibold px-6 py-2 mt-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
          Google ile Giriş Yap
        </button>
      )}
    </div>
  );
}

// NOTE: Place <AuthFooter /> in the return JSX of each page you want it on.
// For example, at the end of <LikedRecipesPage /> or <CustomRecipePage /> component render.

// ✅ You can now reuse <AuthFooter /> in any page by importing it and placing it at the bottom of the page.
// Example:
// return (
//   <div>
//     ... rest of your page
//     <AuthFooter />
//   </div>
// );
