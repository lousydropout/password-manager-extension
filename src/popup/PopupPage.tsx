// src/popup/PopupPage.tsx
import { FC } from "react";
import { LoginForm } from "../components/LoginForm";
// import { useSessionStorage } from "../hooks/useSessionStorage";
import { useChromeStorageLocal } from "../hooks/useChromeLocalStorage";
import { generateKey } from "../utils/encryption";

const PopupPage: FC = () => {
  const [loggedIn, setLoggedIn] = useChromeStorageLocal<boolean>(
    "loggedIn",
    false
  );
  const [wrappedKey, setWrappedKey] = useChromeStorageLocal<string>(
    "wrappedKey",
    ""
  );

  const handleGenerateKey = async (password: string) => {
    try {
      const { wrappedKey } = await generateKey(password);
      setWrappedKey(wrappedKey);
    } catch (error) {
      console.error("Error generating key:", error);
    }
  };

  return (
    <div className="p-4 w-96 h-96">
      <h2>{wrappedKey}</h2>
      <button onClick={() => handleGenerateKey("password")}>
        Generate Key
      </button>
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

export { PopupPage };
