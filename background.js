// Initialize extension state
let isEnabled = true;

// Handle toolbar icon clicks
chrome.action.onClicked.addListener(() => {
  isEnabled = !isEnabled;

  // Update icon title
  chrome.action.setTitle({
    title: `Odds Converter: ${isEnabled ? "ON" : "OFF"}`,
  });

  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { isEnabled });
  });
});

// Respond to content script checking enabled state
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getState") {
    sendResponse({ isEnabled });
  }
  return true; // Required for Chrome's async sendResponse
});
