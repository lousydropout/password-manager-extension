console.log("Background script running.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[background] Message received: ", message);
  // Handle the message
  chrome.storage.local.set({ wrappedKey: message.password });
  sendResponse({ acknowledged: true });
  return true; // Keep the messaging channel open for asynchronous response
});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true }) // set to `false` to allow regular popups
  .catch((error) => console.error(error));

// Listen for when a tab is activated (switched to).
chrome.tabs.onActivated.addListener(function () {
  updateSidePanel();
});

// Listen for when a tab is updated (e.g., URL change).
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.url) {
    updateSidePanel();
  }
});

// This function notifies the side panel to update its content.
function updateSidePanel() {
  chrome.runtime.sendMessage({ action: "updateUrl" }).catch((e) => {
    console.log("[warning] potential updateSidePanel failure: ", e);
  });
}
