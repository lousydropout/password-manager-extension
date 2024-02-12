console.log("Content script running.");

const EVENT_TYPE = "FROM_PAGE";
const EVENT_ORIGIN = "http://localhost:5173";

window.addEventListener("message", (event) => {
  console.log("event: ", event);
  // Validate sender origin to ensure security (for production use)
  if (event.origin !== EVENT_ORIGIN) {
    return; // Ignore messages from unknown origins
  }

  if (event.data.type && event.data.type === EVENT_TYPE) {
    console.log("Secret password received from page:", event.data.message);
    chrome.runtime.sendMessage({ password: event.data.message });
  }
});
