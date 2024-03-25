import { useEffect, useState } from "react";

const getHostname = (
  currentTab: chrome.tabs.Tab | undefined
): string | null => {
  if (currentTab === undefined) return null;

  if (currentTab?.url) {
    try {
      const urlParts = new URL(currentTab.url);
      const hostname = urlParts.hostname;
      const parts = hostname.split(".");
      if (parts.length > 2) {
        return parts.slice(1).join(".");
      }
      return hostname;
    } catch (e) {
      console.log("Unable to read current tab's url: ", e);
    }
  }
  return null;
};

export function useCurrentTab(): [chrome.tabs.Tab | undefined, string | null] {
  const [tab, setTab] = useState<chrome.tabs.Tab | undefined>(undefined);

  useEffect(() => {
    const updateUrl = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) =>
        setTab(currentTab)
      );
    };

    updateUrl();

    const onActivatedListener = () => updateUrl();
    const onUpdatedListener = (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo
    ) => {
      if (changeInfo.url) updateUrl();
    };

    chrome.tabs.onActivated.addListener(onActivatedListener);
    chrome.tabs.onUpdated.addListener(onUpdatedListener);

    return () => {
      chrome.tabs.onActivated.removeListener(onActivatedListener);
      chrome.tabs.onUpdated.removeListener(onUpdatedListener);
    };
  }, []);

  return [tab, getHostname(tab)];
}
