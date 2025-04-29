"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { User } from "firebase/auth";

interface AuthSectionProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigateToUserPage: () => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({ user, onLogin, onLogout, onNavigateToUserPage }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-12 text-center">
      {user ? (
        <div className="flex flex-col items-center gap-2">
          <p
            onClick={onNavigateToUserPage}
            className="text-sm cursor-pointer hover:underline"
          >
            👋 <strong>{user.displayName || ""}</strong>
          </p>
          <button
            onClick={onLogout}
            className="text-red-600 hover:text-red-800 underline text-sm"
          >
            {t('landing.logout')}
          </button>
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="bg-white text-gray-800 font-semibold px-6 py-2 border border-gray-300 rounded-lg shadow hover:shadow-md flex items-center gap-2 mx-auto"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
          {t('landing.loginWithGoogle')}
        </button>
      )}
    </div>
  );
};

export default AuthSection;