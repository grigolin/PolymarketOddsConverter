let isEnabled = true;
let observer = null;

function convertToDecimal(probability) {
  const decimal = probability / 100;
  if (decimal <= 0) return "N/A";
  // Calculate decimal odds: 1 / probability
  return (1 / decimal).toFixed(3);
}

function updatePrices() {
  if (!isEnabled) return;

  // Method 1: Handle spans with the specific class (for split text nodes)
  const priceSpans = document.querySelectorAll('span[class*="bEWXcN"]');
  priceSpans.forEach((span) => {
    // Skip if we've already processed this span
    if (span.textContent.includes("(")) return;

    // Match the full price including the ¢ symbol
    const match = span.textContent.match(/(\d+\.?\d*)¢/);
    if (!match) return;

    const probability = parseFloat(match[1]);
    const decimal = convertToDecimal(probability);

    // Add decimal odds in parentheses before the original price
    span.textContent = `(${decimal}) ${span.textContent}`;
  });

  // Method 2: Handle single text nodes containing the full price
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        // Skip nodes that are inside the price spans we already processed
        if (node.parentElement?.classList?.contains("bEWXcN"))
          return NodeFilter.FILTER_REJECT;
        return node.nodeValue.includes("¢")
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    // Skip if we've already processed this node
    if (node.nodeValue.includes("(")) continue;

    // Extract numbers followed by ¢
    const prices = node.nodeValue.match(/(\d+\.?\d*)¢/g);
    if (!prices) continue;

    let newText = node.nodeValue;
    prices.forEach((price) => {
      const probability = parseFloat(price);
      const decimal = convertToDecimal(probability);
      newText = newText.replace(price, `(${decimal}) ${price}`);
    });

    node.nodeValue = newText;
  }
}

function removeDecimalOdds() {
  // Method 1: Clean up spans with the specific class
  const priceSpans = document.querySelectorAll('span[class*="bEWXcN"]');
  priceSpans.forEach((span) => {
    span.textContent = span.textContent.replace(/\(\d+\.\d+\) /g, "");
  });

  // Method 2: Clean up other text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        if (node.parentElement?.classList?.contains("bEWXcN"))
          return NodeFilter.FILTER_REJECT;
        return node.nodeValue.includes("¢")
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    node.nodeValue = node.nodeValue.replace(/\(\d+\.\d+\) /g, "");
  }
}

function setupObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(() => {
    if (isEnabled) {
      updatePrices();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  isEnabled = message.isEnabled;
  if (isEnabled) {
    updatePrices();
  } else {
    removeDecimalOdds();
  }
});

// Check initial state
chrome.runtime.sendMessage({ action: "getState" }, (response) => {
  isEnabled = response.isEnabled;
  if (isEnabled) {
    updatePrices();
  }
  setupObserver();
});
