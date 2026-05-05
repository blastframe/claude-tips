document.addEventListener("DOMContentLoaded", async () => {
  // Load tips data
  const response = await fetch("tips.json");
  const data = await response.json();

  // Build a map of category labels to their metadata
  const categoryMap = {};
  data.categories.forEach((cat) => {
    categoryMap[cat.label] = cat;
  });

  // Get all unique categories from tips
  const tipCategories = data.tips.map((item) => item.category);
  const uniqueCategories = [...new Set(tipCategories)];

  // Initialize filter state with all categories selected
  let selectedCategories = new Set(uniqueCategories);

  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const filterContainer = document.querySelector(".filter-container");
  const filterToggle = document.querySelector(".filter-toggle");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(target)?.classList.add("active");

      // Show filter only on tips tab
      filterContainer.style.display = target === "tips" ? "block" : "none";
    });
  });

  // Populate filter menu
  const filterOptions = document.querySelector(".filter-options");
  uniqueCategories.forEach((categoryLabel) => {
    const categoryData = categoryMap[categoryLabel] || {};
    const label = document.createElement("label");
    label.className = "filter-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "filter-checkbox";
    checkbox.value = categoryLabel;
    checkbox.checked = true;

    const iconSpan = document.createElement("span");
    iconSpan.className = "material-icons-outlined";
    iconSpan.textContent = categoryData.icon || "folder";

    const labelText = document.createElement("span");
    labelText.className = "filter-label";
    labelText.textContent = categoryLabel;

    label.appendChild(checkbox);
    label.appendChild(iconSpan);
    label.appendChild(labelText);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedCategories.add(categoryLabel);
      } else {
        selectedCategories.delete(categoryLabel);
      }
      applyFilters();
    });

    filterOptions.appendChild(label);
  });

  // Filter toggle
  const filterMenu = document.querySelector(".filter-menu");

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

  // Apply filters function
  function applyFilters() {
    const tipsPanel = document.getElementById("tips");
    const categories = tipsPanel.querySelectorAll(".category");

    categories.forEach((category) => {
      const header = category.querySelector(".category-header");
      const categoryName = header.textContent;

      if (selectedCategories.has(categoryName)) {
        category.style.display = "block";
      } else {
        category.style.display = "none";
      }
    });
  }

  // Tip expansion
  const triggers = document.querySelectorAll(".tip-trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const tip = trigger.closest(".tip-item");
      if (!tip) return;
      const isExpanded = tip.classList.contains("expanded");

      document.querySelectorAll(".tip-item").forEach((item) => {
        item.classList.remove("expanded");
      });

      if (!isExpanded) {
        tip.classList.add("expanded");
      }
    });
  });

  // Disable filter on initial load (not on tips tab)
  filterToggle.disabled = true;
});
