"use strict";

// Filtro por receta de «Històries i experiències BARFEAND». Las historias están en el HTML estático.
document.addEventListener("DOMContentLoaded", () => {
  const filtre = document.querySelector(".hs-filter");
  if (!filtre) return;

  const botons = filtre.querySelectorAll(".hs-filter__btn");
  const histories = document.querySelectorAll(".hs-story");
  const mes = document.querySelector(".hs-more");

  botons.forEach((boto) => {
    boto.addEventListener("click", () => {
      const recepta = boto.dataset.receta;
      botons.forEach((altre) => altre.setAttribute("aria-pressed", altre === boto ? "true" : "false"));
      histories.forEach((historia) => {
        historia.hidden = recepta !== "" && historia.dataset.receta !== recepta;
      });
      if (mes) mes.hidden = !mes.querySelector(".hs-story:not([hidden])");
    });
  });
});
