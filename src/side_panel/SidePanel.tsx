import { FC, useEffect } from "react";
import { LoginForm } from "../components/LoginForm";
import { useChromeStorageLocal } from "../hooks/useChromeLocalStorage";
import { generateKey } from "../utils/encryption";

const SidePanel: FC = () => {
  const [loggedIn, setLoggedIn] = useChromeStorageLocal<boolean>(
    "loggedIn",
    false
  );
  const [wrappedKey, setWrappedKey] = useChromeStorageLocal<string>(
    "wrappedKey",
    ""
  );

  function updateUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      if (currentTab) {
        const urlParts = new URL(currentTab.url as string);
        setUrl(urlParts.hostname);
      }
    });
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.action === "updateUrl") {
        updateUrl();
      }
    });

    // In the popup script or a React useEffect hook
    document.addEventListener("DOMContentLoaded", function () {
      chrome.storage.local.get(["wrappedKey"], function (result) {
        setWrappedKey(result["wrappedKey"]);
      });
    });

    updateUrl();
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      let urlParts;
      try {
        urlParts = new URL(currentTab.url as string);
        setUrl(urlParts.hostname);
      } catch (e) {
        console.log(`Unable to read current tab's url: `, currentTab);
      }
    });
  }, []);

  const [url, setUrl] = useChromeStorageLocal<String>("url", "unknown");

  const handleGenerateKey = async (password: string) => {
    try {
      const { wrappedKey } = await generateKey(password);
      setWrappedKey(wrappedKey);
    } catch (error) {
      console.error("Error generating key:", error);
    }
  };

  return (
    <div className="p-4 max-w-full w-96 h-96">
      {/* <button onClick={() => }>Refresh</button> */}
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

export { SidePanel };
