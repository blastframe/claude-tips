document.addEventListener("DOMContentLoaded", async () => {
  // Load tips data
  const response = await fetch("tips.json");
  const data = await response.json();

  // Build a map of category labels to their metadata
  const categoryMap = {};
  data.categories.forEach((cat) => {
    categoryMap[cat.label] = cat;
  });

  // Get all unique categories from tips (preserves insertion order)
  const tipCategories = data.tips.map((item) => item.category);
  const uniqueCategories = [...new Set(tipCategories)];

  // Initialize filter and mode state
  let selectedCategory = null;
  let mode = "category";
  let currentTipIndex = null;
  const allTips = [];
  const STORAGE_KEY = "claudeTipsSettings";

  // Build flat tip list for random mode
  data.tips.forEach((categoryGroup) => {
    categoryGroup.entries.forEach((entry) => {
      allTips.push({
        category: categoryGroup.category,
        icon: entry.icon || "lightbulb",
        title: entry.title,
        tip: entry.tip,
      });
    });
  });

  const contentArea = document.querySelector(".content-area");
  const filterOptions = document.querySelector(".filter-options");
  const filterContainer = document.querySelector(".filter-container");
  const filterMenu = document.querySelector(".filter-menu");
  const randomModeButton = document.querySelector(".random-mode-button");
  const modeActionButton = document.querySelector(".mode-action-button");
  const docButton = document.querySelector(".doc-button");
  const filterMenuHeader = filterMenu.querySelector(".filter-menu-header");

  function loadSettings() {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        chrome.storage.local.get(STORAGE_KEY, (result) => {
          resolve(result[STORAGE_KEY] || {});
        });
      } else {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        resolve(saved ? JSON.parse(saved) : {});
      }
    });
  }

  function saveSettings() {
    const payload = {
      mode,
      selectedCategory,
      currentTipIndex,
    };

    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ [STORAGE_KEY]: payload });
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  }

  function updateFilterButtons() {
    document.querySelectorAll(".filter-button").forEach((btn) => {
      if (btn.dataset.category === selectedCategory) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  async function initState() {
    const saved = await loadSettings();
    if (saved.mode) {
      mode = saved.mode;
    }
    if (saved.selectedCategory) {
      selectedCategory = saved.selectedCategory;
    }
    if (saved.currentTipIndex !== undefined && saved.currentTipIndex !== null) {
      currentTipIndex = saved.currentTipIndex;
    }

    if (mode === "random") {
      chooseRandomTip();
    }
  }

  function renderContent() {
    contentArea.innerHTML = "";

    if (mode === "random") {
      renderRandomTip();
    } else {
      renderCategoryList();
    }

    updateFilterMenuState();
    updateFilterButtons();
  }

  function createCopyButton(getCopyText) {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.setAttribute("aria-label", "Copy tip to clipboard");

    const icon = document.createElement("span");
    icon.className = "material-icons-outlined";
    icon.textContent = "content_copy";

    button.appendChild(icon);

    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const text =
        typeof getCopyText === "function" ? getCopyText() : getCopyText;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
      } catch (error) {
        console.warn("Clipboard copy failed", error);
      }

      button.classList.add("copied");
      icon.textContent = "check";

      window.setTimeout(() => {
        button.classList.remove("copied");
        icon.textContent = "content_copy";
      }, 1000);
    });

    return button;
  }

  function renderCategoryList() {
    data.tips.forEach((categoryGroup) => {
      const section = document.createElement("div");
      section.className = "category";

      const header = document.createElement("div");
      header.className = "category-header";
      header.textContent = categoryGroup.category;
      section.appendChild(header);

      categoryGroup.entries.forEach((entry) => {
        const tipItem = document.createElement("div");
        tipItem.className = "tip-item";

        const trigger = document.createElement("button");
        trigger.className = "tip-trigger";

        const icon = document.createElement("span");
        icon.className = "material-icons-outlined";
        icon.textContent = entry.icon || "lightbulb";

        const title = document.createElement("span");
        title.textContent = entry.title;

        trigger.appendChild(icon);
        trigger.appendChild(title);

        const bodyWrapper = document.createElement("div");
        bodyWrapper.className = "tip-body-wrapper";

        const body = document.createElement("div");
        body.className = "tip-body";
        body.textContent = entry.tip;

        const copyButton = createCopyButton(() => entry.tip);
        copyButton.classList.add("tip-copy-button");

        bodyWrapper.appendChild(body);
        tipItem.appendChild(trigger);
        tipItem.appendChild(bodyWrapper);
        tipItem.appendChild(copyButton);

        trigger.addEventListener("click", () => {
          const isExpanded = tipItem.classList.contains("expanded");

          document.querySelectorAll(".tip-item").forEach((item) => {
            item.classList.remove("expanded");
          });

          if (!isExpanded) {
            tipItem.classList.add("expanded");
          }
        });

        section.appendChild(tipItem);
      });

      contentArea.appendChild(section);
    });

    applyFilters();
  }

  function renderRandomTip() {
    if (currentTipIndex === null) {
      chooseRandomTip();
    }

    const tip = allTips[currentTipIndex];

    const card = document.createElement("div");
    card.className = "random-tip-card";

    const categoryHeading = document.createElement("div");
    categoryHeading.className = "random-tip-category";
    categoryHeading.textContent = tip.category.toUpperCase();

    const header = document.createElement("div");
    header.className = "random-tip-header";

    const icon = document.createElement("span");
    icon.className = "material-icons-outlined";
    icon.textContent = tip.icon;

    const title = document.createElement("div");
    title.className = "random-tip-title";
    title.textContent = tip.title;

    header.appendChild(icon);
    header.appendChild(title);

    const body = document.createElement("div");
    body.className = "random-tip-body";
    body.textContent = tip.tip;

    const copyButton = createCopyButton(() => tip.tip);
    copyButton.classList.add("random-tip-copy-button");

    card.appendChild(categoryHeading);
    card.appendChild(header);
    card.appendChild(copyButton);
    card.appendChild(body);
    contentArea.appendChild(card);
  }

  function chooseRandomTip() {
    if (allTips.length === 0) {
      currentTipIndex = null;
      return;
    }

    let nextIndex = Math.floor(Math.random() * allTips.length);
    if (allTips.length > 1) {
      while (nextIndex === currentTipIndex) {
        nextIndex = Math.floor(Math.random() * allTips.length);
      }
    }
    currentTipIndex = nextIndex;
    saveSettings();
  }

  // Populate filter menu with exclusive buttons
  uniqueCategories.forEach((categoryLabel) => {
    const categoryData = categoryMap[categoryLabel] || {};
    const button = document.createElement("button");
    button.className = "filter-button";
    button.dataset.category = categoryLabel;

    const iconSpan = document.createElement("span");
    iconSpan.className = "material-icons-outlined";
    iconSpan.textContent = categoryData.icon || "folder";

    const labelText = document.createElement("span");
    labelText.className = "filter-label";
    labelText.textContent = categoryLabel;

    button.appendChild(iconSpan);
    button.appendChild(labelText);

    button.addEventListener("click", () => {
      if (selectedCategory === categoryLabel) {
        selectedCategory = null;
      } else {
        selectedCategory = categoryLabel;
      }

      if (mode === "random") {
        mode = "category";
      }

      saveSettings();
      renderContent();
    });

    filterOptions.appendChild(button);
  });

  if (randomModeButton) {
    randomModeButton.addEventListener("click", () => {
      mode = mode === "random" ? "category" : "random";
      if (mode === "random") {
        chooseRandomTip();
      }
      saveSettings();
      renderContent();
    });
  }

  if (modeActionButton) {
    modeActionButton.addEventListener("click", () => {
      if (mode === "random") {
        chooseRandomTip();
        renderContent();
      } else {
        filterMenu.classList.toggle("visible");
      }
    });
  }

  if (docButton) {
    docButton.addEventListener("click", () => {
      window.open("https://platform.claude.com/docs/", "_blank");
    });
  }

  initState().then(renderContent);

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !filterContainer.contains(e.target) &&
      (!modeActionButton || !modeActionButton.contains(e.target)) &&
      e.target !== modeActionButton
    ) {
      filterMenu.classList.remove("visible");
    }
  });

  function updateFilterMenuState() {
    filterMenuHeader.style.display = mode === "random" ? "none" : "block";
    randomModeButton.classList.toggle("active", mode === "random");
    filterOptions.style.display = mode === "random" ? "none" : "flex";
    filterMenu.classList.remove("visible");

    if (modeActionButton) {
      const icon = modeActionButton.querySelector(".material-icons-outlined");
      if (mode === "random") {
        icon.textContent = "autorenew";
        modeActionButton.title = "Next tip";
        modeActionButton.setAttribute("aria-label", "Next tip");
      } else {
        icon.textContent = "tune";
        modeActionButton.title = "Filter categories";
        modeActionButton.setAttribute("aria-label", "Filter categories");
      }
    }
  }

  function applyFilters() {
    const categories = contentArea.querySelectorAll(".category");

    categories.forEach((category) => {
      const header = category.querySelector(".category-header");
      const categoryName = header.textContent;

      if (selectedCategory === null || categoryName === selectedCategory) {
        category.style.display = "block";
      } else {
        category.style.display = "none";
      }
    });
  }
});
