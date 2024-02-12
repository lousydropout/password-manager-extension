import { FC, useEffect, useState } from "react";
import { LoginForm } from "../components/LoginForm";
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

  const [url, setUrl] = useState<String>("unknown");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      const urlParts = new URL(currentTab.url as string);
      setUrl(urlParts.hostname);
    });
  }, []);

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
      <h2>
        {url}: {wrappedKey}
      </h2>
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
