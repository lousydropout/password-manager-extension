// src/popup/PopupPage.tsx
import React from "react";
import LoginForm from "../components/LoginForm";
import useSessionStorage from "../hooks/useSessionStorage";

const PopupPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useSessionStorage<boolean>("loggedIn", false);

  return (
    <div className="p-4 w-96 h-96">
      {!loggedIn ? (
        <LoginForm onLoginSuccess={() => setLoggedIn(true)} />
      ) : (
        <div>
          {/* Render logged-in state UI */}
          <p>You are logged in.</p>
        </div>
      )}
    </div>
  );
};

export default PopupPage;
