// Basic interactions for the static Valley Bowl site
(function () {
  function setYear(selector) {
    var el = document.querySelector(selector);
    if (el) el.textContent = new Date().getFullYear();
  }
  setYear("#year");
  setYear("#year-league");
  setYear("#year-events");
  setYear("#year-contact");

  // snackbar toggles: there are multiple pages with different toggle IDs
  var toggles = document.querySelectorAll(".snackbar-toggle");
  var snackbar = document.getElementById("snackbar");
  var closeBtns = document.querySelectorAll(".snackbar-close");

  function openSnackbar() {
    if (!snackbar) return;
    snackbar.setAttribute("aria-hidden", "false");
    Array.from(toggles).forEach((t) => t.setAttribute("aria-expanded", "true"));
  }
  function closeSnackbar() {
    if (!snackbar) return;
    snackbar.setAttribute("aria-hidden", "true");
    Array.from(toggles).forEach((t) =>
      t.setAttribute("aria-expanded", "false")
    );
  }

  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) closeSnackbar();
      else openSnackbar();
    });
  });
  closeBtns.forEach(function (b) {
    b.addEventListener("click", closeSnackbar);
  });

  // Close on escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSnackbar();
  });

  // Close if user clicks outside
  document.addEventListener("click", function (e) {
    if (!snackbar) return;
    var inside =
      snackbar.contains(e.target) ||
      Array.from(toggles).some((t) => t.contains(e.target));
    if (!inside) closeSnackbar();
  });
})();
