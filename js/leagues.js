document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter-chip");
  const leagueCards = document.querySelectorAll(".league-card");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const filterValue = filter.dataset.filter;

      // Update active filter
      filters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");

      // Show/hide league cards
      leagueCards.forEach((card) => {
        if (filterValue === "all" || card.dataset.category === filterValue) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
});
