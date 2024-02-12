console.log("Background script running.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[background] Message received: ", message);
  // Handle the message
  chrome.storage.local.set({ wrappedKey: message.password });
  sendResponse({ acknowledged: true });
  return true; // Keep the messaging channel open for asynchronous response
});
