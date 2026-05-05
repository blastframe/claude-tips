document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });

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
});
