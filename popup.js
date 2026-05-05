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
  const filterToggle = document.querySelector(".filter-toggle");
  const filterMenu = document.querySelector(".filter-menu");
  const randomModeToggle = document.querySelector(".random-mode-toggle");
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

        bodyWrapper.appendChild(body);
        tipItem.appendChild(trigger);
        tipItem.appendChild(bodyWrapper);

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

    const actions = document.createElement("div");
    actions.className = "random-tip-actions";

    const nextButton = document.createElement("button");
    nextButton.className = "random-tip-button";
    nextButton.type = "button";

    const nextIcon = document.createElement("span");
    nextIcon.className = "material-icons-outlined";
    nextIcon.textContent = "autorenew";

    const nextLabel = document.createElement("span");
    nextLabel.textContent = "New tip";

    nextButton.appendChild(nextIcon);
    nextButton.appendChild(nextLabel);
    nextButton.addEventListener("click", () => {
      chooseRandomTip();
      renderContent();
    });

    actions.appendChild(nextButton);
    card.appendChild(categoryHeading);
    card.appendChild(header);
    card.appendChild(body);
    contentArea.appendChild(card);
    contentArea.appendChild(actions);
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

  randomModeToggle.addEventListener("click", () => {
    mode = mode === "random" ? "category" : "random";
    if (mode === "random") {
      chooseRandomTip();
    }
    saveSettings();
    renderContent();
  });

  initState().then(renderContent);

  // Filter toggle
  filterToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    filterMenu.classList.toggle("visible");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!filterContainer.contains(e.target)) {
      filterMenu.classList.remove("visible");
    }
  });

  function updateFilterMenuState() {
    filterMenuHeader.textContent =
      mode === "random" ? "Random tip mode" : "Filter by category";
    randomModeToggle.classList.toggle("active", mode === "random");
    filterOptions.style.display = mode === "random" ? "none" : "flex";
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
