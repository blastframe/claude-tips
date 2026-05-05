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

  // Initialize filter state with all categories selected
  let selectedCategories = new Set(uniqueCategories);

  // Render all tips dynamically into the content area
  const contentArea = document.querySelector(".content-area");
  const filterOptions = document.querySelector(".filter-options");
  const filterContainer = document.querySelector(".filter-container");
  const filterToggle = document.querySelector(".filter-toggle");
  const filterMenu = document.querySelector(".filter-menu");

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

  // Populate filter menu
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
    const categories = contentArea.querySelectorAll(".category");

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
});
