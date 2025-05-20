// START Display/Hide Section
(() => {
  "use strict";
  // Section mappings
  const sectionMap = {
    "unit-converters-button": ".unit-converters",
    "clock-and-timers-button": ".clock-and-timers",
    "file-format-converters-button": ".file-format-converters",
  };

  const toolTypesSection = document.querySelector(".tool-types-section");
  const allSections = Object.values(sectionMap).map((selector) =>
    document.querySelector(selector)
  );

  // Hide all specific sections
  const hideAllSections = () => {
    allSections.forEach((section) => section.classList.add("hide"));
  };

  // Handle tool button clicks
  Object.entries(sectionMap).forEach(([btnId, sectionSelector]) => {
    const button = document.getElementById(btnId);
    const section = document.querySelector(sectionSelector);

    if (button && section) {
      button.addEventListener("click", () => {
        toolTypesSection.classList.add("hide");
        hideAllSections();
        section.classList.remove("hide");
      });
    }
  });

  // Handle all back buttons
  document.querySelectorAll(".back-button").forEach((button) => {
    button.addEventListener("click", () => {
      toolTypesSection.classList.remove("hide");
      hideAllSections();
    });
  });
})();
// END Display/Hide Section
