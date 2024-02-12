import { useState, useEffect } from "react";

// Assuming you have the types for chrome.storage,
// if not you might need to install @types/chrome or define them yourself
interface ChromeStorageSessionSet {
  [key: string]: string;
}

// Define a generic type T for the value to be stored in Chrome's session storage
function useChromeStorageSession<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    // Asynchronously get the stored value from chrome.storage.session
    chrome.storage.session.get([key], (result: ChromeStorageSessionSet) => {
      if (result[key] !== undefined) {
        try {
          // Assuming JSON.parse successfully returns the correct type
          setValue(JSON.parse(result[key]) as T);
        } catch (error) {
          console.log("[Warning] Error parsing value from storage:", error);
          // If parsing fails and you know the fallback is of type T, cast it
          // If you're unsure about the fallback value's type compatibility with T, handle accordingly
          setValue(result[key] as unknown as T); // Use unknown as an intermediary if direct cast is not allowed
        }
      }
    });
  }, [key]);

  useEffect(() => {
    // Convert the value back into a JSON string for storage in chrome.storage.session
    // and save it asynchronously
    const valueToStore: string = JSON.stringify(value);
    chrome.storage.session.set({ [key]: valueToStore });
  }, [key, value]);

  // Wrap the setValue function to update the state and chrome.storage.session
  const setStoredValue: React.Dispatch<React.SetStateAction<T>> = (
    valueAction
  ) => {
    // Determine if valueAction is a function and execute it if so, otherwise return it directly
    const valueToStore: T =
      valueAction instanceof Function ? valueAction(value) : valueAction;
    // Update the SesuseChromeStorageSession state
    setValue(valueToStore);
    // Update chrome.storage.session
    chrome.storage.session.set({ [key]: JSON.stringify(valueToStore) });
  };

  // Return the current value and the modified setter function, both typed correctly
  return [value, setStoredValue];
}

export { useChromeStorageSession };
