console.log("Content script running.");

const EVENT_TYPE = "FROM_PAGE";

window.addEventListener("message", (event) => {
  // Fetch the targetOrigin each time a message is received
  chrome.storage.local.get("targetOrigin", (data) => {
    // Use the retrieved targetOrigin if it exists, otherwise default to "http://localhost:5173"
    const targetOrigin = data.targetOrigin || "http://localhost:5173";

    // Check if the message's origin matches the targetOrigin
    if (event.origin !== targetOrigin) {
      console.warn(
        `Ignoring message from ${event.origin}, expected ${targetOrigin}`
      );
      return;
    }

    // Process the message as it matches the expected origin
    if (event.data.type && event.data.type === EVENT_TYPE) {
      chrome.runtime.sendMessage({ password: event.data.message });
    }
  });
});
