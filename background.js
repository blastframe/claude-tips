const ENABLED_ICON_PATHS = {
  16: "icons/claude-tips-16.png",
  32: "icons/claude-tips-32.png",
  48: "icons/claude-tips-48.png",
  128: "icons/claude-tips-128.png",
};

const DISABLED_ICON_PATHS = {
  16: "icons/claude-tips-disabled-16.png",
  32: "icons/claude-tips-disabled-32.png",
  48: "icons/claude-tips-disabled-48.png",
  128: "icons/claude-tips-disabled-128.png",
};

function isClaudeUrl(url) {
  return typeof url === "string" && url.toLowerCase().includes("claude");
}

function updateActionIcon(tabId) {
  if (typeof tabId !== "number") {
    return;
  }

  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab) {
      return;
    }

    const path =
      !tab.url || !isClaudeUrl(tab.url)
        ? DISABLED_ICON_PATHS
        : ENABLED_ICON_PATHS;

    chrome.action.setIcon({ tabId, path }, () => {
      if (chrome.runtime.lastError) {
        // Ignore tab-specific icon failures for stale tab IDs.
      }
    });
  });
}

function refreshActiveTabIcon() {
  chrome.windows.getCurrent({ populate: true }, (window) => {
    if (chrome.runtime.lastError || !window || !window.tabs) {
      return;
    }

    const activeTab = window.tabs.find((tab) => tab.active);
    if (activeTab) {
      updateActionIcon(activeTab.id);
    }
  });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  updateActionIcon(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading" || changeInfo.status === "complete") {
    updateActionIcon(tabId);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    return;
  }

  chrome.windows.get(windowId, { populate: true }, (window) => {
    if (chrome.runtime.lastError || !window || !window.tabs) {
      return;
    }

    const activeTab = window.tabs.find((tab) => tab.active);
    if (activeTab) {
      updateActionIcon(activeTab.id);
    }
  });
});

chrome.runtime.onStartup.addListener(refreshActiveTabIcon);
chrome.runtime.onInstalled.addListener(refreshActiveTabIcon);
