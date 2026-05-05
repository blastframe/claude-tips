document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".tip-trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const parent = trigger.parentElement;
      const isExpanded = parent.classList.contains("expanded");

      // Close all other tips for a clean accordion effect
      document.querySelectorAll(".tip-item").forEach((item) => {
        item.classList.remove("expanded");
      });

      // Toggle current
      if (!isExpanded) {
        parent.classList.add("expanded");
      }
    });
  });
});
