(() => {
  "use strict";

  const root = document.documentElement;
  const assetBase = root.dataset.assetBase || "assets";
  const day = String(new Date().getDate()).padStart(2, "0");

  for (const image of document.querySelectorAll("[data-calendar-today]")) {
    image.src = `${assetBase}/icons/calendar-days/${day}.png`;
  }

  for (const year of document.querySelectorAll("[data-current-year]")) {
    year.textContent = String(new Date().getFullYear());
  }
})();
