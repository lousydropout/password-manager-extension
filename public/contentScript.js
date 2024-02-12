const EVENT_TYPE = "FROM_PAGE";
const WEB_DAPP = "localhost";

window.addEventListener("message", (event) => {
  // Fetch the targetOrigin each time a message is received
  chrome.storage.local.get("targetOrigin", (data) => {
    // Use the retrieved targetOrigin if it exists, otherwise default to "localhost"
    const targetOrigin = data.targetOrigin || WEB_DAPP;
    // get origin's hostname
    const origin = new URL(event.origin).hostname;

    // Check if the message's origin matches the targetOrigin
    if (origin !== targetOrigin) {
      return;
    }

    // Process the message as it matches the expected origin
    if (event.data.type && event.data.type === EVENT_TYPE) {
      chrome.runtime
        .sendMessage({ password: event.data.message })
        .catch((e) => {
          console.log("[warning] potential sendMessage failure: ", e);
        });
    }
  });
});
