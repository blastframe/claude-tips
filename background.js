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

function getTabById(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        resolve(null);
        return;
      }

      resolve(tab);
    });
  });
}

function setTabIcon(tabId, path) {
  return new Promise((resolve) => {
    chrome.action.setIcon({ tabId, path }, () => {
      if (chrome.runtime.lastError) {
        // Ignore tab-specific icon failures for stale tab IDs.
      }

      resolve();
    });
  });
}

function getWindow(windowId, options) {
  return new Promise((resolve) => {
    chrome.windows.get(windowId, options, (window) => {
      if (chrome.runtime.lastError || !window) {
        resolve(null);
        return;
      }

      resolve(window);
    });
  });
}

function getCurrentWindow(options) {
  return new Promise((resolve) => {
    chrome.windows.getCurrent(options, (window) => {
      if (chrome.runtime.lastError || !window) {
        resolve(null);
        return;
      }

      resolve(window);
    });
  });
}

async function updateActionIcon(tabId) {
  if (typeof tabId !== "number") {
    return;
  }

  const tab = await getTabById(tabId);
  if (!tab) {
    return;
  }

  const path =
    !tab.url || !isClaudeUrl(tab.url)
      ? DISABLED_ICON_PATHS
      : ENABLED_ICON_PATHS;

  await setTabIcon(tabId, path);
}

async function refreshActiveTabIcon() {
  const window = await getCurrentWindow({ populate: true });
  if (!window || !window.tabs) {
    return;
  }

  const activeTab = window.tabs.find((tab) => tab.active);
  if (activeTab) {
    await updateActionIcon(activeTab.id);
  }
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

  getWindow(windowId, { populate: true }).then((window) => {
    if (!window || !window.tabs) {
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
