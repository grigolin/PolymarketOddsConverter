// Initialize extension state
let isEnabled = true;

// Handle toolbar icon clicks
browser.browserAction.onClicked.addListener(() => {
  isEnabled = !isEnabled;

  // Update icon title
  browser.browserAction.setTitle({
    title: `Odds Converter: ${isEnabled ? "ON" : "OFF"}`,
  });

  // Send message to content script
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { isEnabled });
  });
});

// Respond to content script checking enabled state
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getState") {
    sendResponse({ isEnabled });
  }
});
