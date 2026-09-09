"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const botoMenu = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav");

  function canviarMenu(obert) {
    if (!botoMenu || !menu) return;

    botoMenu.setAttribute("aria-expanded", String(obert));
    botoMenu.setAttribute("aria-label", obert ? "Tancar el menú" : "Obrir el menú");
    menu.classList.toggle("open", obert);
    document.body.classList.toggle("menu-open", obert);
  }

  if (botoMenu && menu) {
    botoMenu.addEventListener("click", () => {
      const obert = botoMenu.getAttribute("aria-expanded") === "true";
      canviarMenu(!obert);
    });

    menu.querySelectorAll("a").forEach((enllac) => {
      enllac.addEventListener("click", () => canviarMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") canviarMenu(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1000) canviarMenu(false);
    });
  }

  document.querySelectorAll(".product-card").forEach((targeta) => {
    const foto = targeta.querySelector(".product-photo");
    const preu = targeta.querySelector(".price");
    const nom = targeta.querySelector("h3")?.textContent?.trim() || "producte";

    targeta.querySelectorAll("button.format").forEach((botoFormat) => {
      botoFormat.addEventListener("click", () => {
        targeta.querySelectorAll("button.format").forEach((boto) => {
          boto.classList.remove("active");
          boto.setAttribute("aria-pressed", "false");
        });

        botoFormat.classList.add("active");
        botoFormat.setAttribute("aria-pressed", "true");

        if (foto && botoFormat.dataset.image) {
          const pes = botoFormat.dataset.weight === "1000" ? "1 kg" : "500 g";
          foto.src = botoFormat.dataset.image;
          foto.alt = `Paquet BARFEAND de ${nom.toLowerCase()} de ${pes}`;
        }

        if (preu && botoFormat.dataset.price) {
          preu.textContent = botoFormat.dataset.price;
        }
      });
    });
  });

  const dialeg = document.getElementById("label-dialog");
  const titolDialeg = document.getElementById("dialog-title");
  const imatgeEtiqueta = document.getElementById("dialog-label-image");
  const botoTancar = document.querySelector(".dialog-close");

  document.querySelectorAll(".label-button").forEach((boto) => {
    boto.addEventListener("click", () => {
      const targeta = boto.closest(".product-card");
      if (!targeta || !dialeg || !imatgeEtiqueta) return;

      const nom = targeta.dataset.labelName || targeta.querySelector("h3")?.textContent || "Producte BARFEAND";
      const etiqueta = targeta.dataset.labelImage;
      if (!etiqueta) return;

      if (titolDialeg) titolDialeg.textContent = nom;
      imatgeEtiqueta.src = etiqueta;
      imatgeEtiqueta.alt = `Etiqueta de referència de BARFEAND ${nom}`;
      dialeg.showModal();
    });
  });

  botoTancar?.addEventListener("click", () => dialeg?.close());

  dialeg?.addEventListener("click", (event) => {
    if (event.target === dialeg) dialeg.close();
  });

  document.querySelectorAll(".accordion details").forEach((actual) => {
    actual.addEventListener("toggle", () => {
      if (!actual.open) return;
      document.querySelectorAll(".accordion details").forEach((altre) => {
        if (altre !== actual) altre.open = false;
      });
    });
  });

  const any = document.getElementById("year");
  if (any) any.textContent = new Date().getFullYear();
});
