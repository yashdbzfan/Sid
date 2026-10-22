const menuButton = document.querySelector("#menu-button");
const primaryNav = document.querySelector("#primary-nav");

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
    }
  });
}

document.querySelectorAll(".timeline-control").forEach((control) => {
  const timeline = document.getElementById(control.getAttribute("aria-controls"));
  const entries = [...timeline.querySelectorAll(".timeline-entry details")];

  function syncControl() {
    const allOpen = entries.every((details) => details.open);
    control.textContent = allOpen ? "Collapse all" : "Expand all";
    control.setAttribute("aria-expanded", String(allOpen));
  }

  control.addEventListener("click", () => {
    const shouldOpen = entries.some((details) => !details.open);
    entries.forEach((details) => { details.open = shouldOpen; });
    syncControl();
  });

  entries.forEach((details) => {
    const indicator = details.parentElement.querySelector(".entry-toggle");
    indicator.addEventListener("click", () => { details.open = !details.open; });
    details.addEventListener("toggle", () => {
      indicator.textContent = details.open ? "−" : "+";
      syncControl();
    });
  });
});

const searchInput = document.querySelector("#pub-search");
const yearFilter = document.querySelector("#year-filter");
const publications = [...document.querySelectorAll(".publication")];
const emptyState = document.querySelector("#empty-state");

if (searchInput && yearFilter && emptyState) {
  function filterPublications() {
    const query = searchInput.value.trim().toLowerCase();
    const year = yearFilter.value;
    let visibleCount = 0;

    publications.forEach((publication) => {
      const matchesQuery = publication.dataset.search.toLowerCase().includes(query);
      const matchesYear = year === "all" || publication.dataset.year === year;
      publication.hidden = !(matchesQuery && matchesYear);
      if (!publication.hidden) visibleCount += 1;
    });

    emptyState.style.display = visibleCount === 0 ? "block" : "none";
  }

  searchInput.addEventListener("input", filterPublications);
  yearFilter.addEventListener("change", filterPublications);
}