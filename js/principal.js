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

  /* Hero més compacte i professional. */
  if (!document.getElementById("estil-hero-barfeand")) {
    const estilHero = document.createElement("style");
    estilHero.id = "estil-hero-barfeand";
    estilHero.textContent = `
      .hero__grid{
        grid-template-columns:minmax(0,1fr) minmax(390px,.82fr);
        gap:clamp(38px,6vw,78px);
        min-height:auto;
        padding-block:68px 82px;
      }
      .hero h1{
        max-width:670px;
        margin-bottom:20px;
        font-size:clamp(2.7rem,4.1vw,4.25rem);
        line-height:1.02;
      }
      .hero .lead{
        max-width:620px;
        font-size:clamp(1rem,1.25vw,1.14rem);
        line-height:1.7;
      }
      .hero__media{
        width:100%;
        max-width:540px;
        justify-self:end;
        padding:14px;
        overflow:hidden;
        border-radius:30px;
        transform:none;
        box-shadow:0 20px 50px rgba(30,22,24,.11);
        transition:transform .25s ease,box-shadow .25s ease;
      }
      .hero__media img{
        width:100%;
        height:auto;
        aspect-ratio:16/10;
        object-fit:cover;
        border-radius:20px;
        transition:transform .35s ease;
      }
      @media(hover:hover){
        .hero__media:hover{
          transform:translateY(-5px);
          box-shadow:0 30px 68px rgba(30,22,24,.16);
        }
        .hero__media:hover img{transform:scale(1.015)}
      }
      @media(max-width:1000px){
        .hero__grid{grid-template-columns:1fr;padding-block:56px 70px}
        .hero h1{max-width:760px}
        .hero__media{max-width:620px;justify-self:center}
      }
      @media(max-width:650px){
        .hero h1{font-size:clamp(2.35rem,11vw,3.45rem)}
        .hero__media{max-width:100%;padding:10px;border-radius:24px}
        .hero__media img{border-radius:16px}
      }
    `;
    document.head.appendChild(estilHero);
  }

  /* Icones oficials dels quatre valors BARFEAND. */
  const iconesValors = [...document.querySelectorAll(".value-icon")];
  iconesValors.forEach((icona, index) => {
    if (index > 3) return;
    icona.textContent = "";
    icona.classList.add("value-icon--brand", `value-icon--${index + 1}`);
  });

  if (iconesValors.length && !document.getElementById("estil-icones-valors-barfeand")) {
    const estilValors = document.createElement("style");
    estilValors.id = "estil-icones-valors-barfeand";
    estilValors.textContent = `
      .value-icon--brand{
        width:100px;
        height:100px;
        border:0;
        border-radius:0;
        background-color:transparent;
        background-image:url("imagenes/iconos/valors.webp");
        background-repeat:no-repeat;
        background-size:400% 100%;
        box-shadow:none;
      }
      .value-icon--1{background-position:0% 0}
      .value-icon--2{background-position:33.333% 0}
      .value-icon--3{background-position:66.667% 0}
      .value-icon--4{background-position:100% 0}
      @media(max-width:650px){.value-icon--brand{width:92px;height:92px}}
    `;
    document.head.appendChild(estilValors);
  }

  /* Pegatines oficials de les gammes BARFEAND. */
  const graellaPegatines = document.querySelector(".badge-row");
  if (graellaPegatines) {
    const pegatines = [
      ["Xai", "imagenes/pegatinas/xai.webp"],
      ["Conill", "imagenes/pegatinas/conill.webp"],
      ["Pollastre", "imagenes/pegatinas/pollastre.webp"],
      ["Gall d’indi", "imagenes/pegatinas/gall-indi.webp"],
      ["Vedella", "imagenes/pegatinas/vedella.webp"],
      ["Porc", "imagenes/pegatinas/porc.webp"]
    ];

    graellaPegatines.className = "sticker-grid";
    graellaPegatines.setAttribute("aria-label", "Pegatines de la gamma monoproteica BARFEAND");
    graellaPegatines.innerHTML = pegatines
      .map(([nom, src]) => `<figure class="sticker-figure"><img src="${src}" alt="Pegatina BARFEAND Monoproteïna ${nom}" width="220" height="220" loading="lazy"></figure>`)
      .join("");
  }

  const distintiuMulti = document.querySelector(".multi-badge");
  if (distintiuMulti) {
    distintiuMulti.className = "sticker-multi";
    distintiuMulti.setAttribute("aria-label", "Pegatina blanca BARFEAND Multiproteïna");
    distintiuMulti.innerHTML = '<img src="imagenes/pegatinas/multiproteina.webp" alt="Pegatina blanca BARFEAND Multiproteïna" width="310" height="310" loading="lazy">';
  }

  if (!document.getElementById("estil-pegatines-barfeand")) {
    const estil = document.createElement("style");
    estil.id = "estil-pegatines-barfeand";
    estil.textContent = `
      .sticker-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:30px;align-items:center}
      .sticker-figure{display:grid;place-items:center;margin:0}
      .sticker-figure img{display:block;width:100%;max-width:190px;height:auto;object-fit:contain;border-radius:0;box-shadow:none}
      .sticker-multi{display:grid;place-items:center;width:100%;margin:0 auto 25px}
      .sticker-multi img{display:block;width:100%;max-width:310px;height:auto;object-fit:contain;border-radius:0;background:transparent;box-shadow:none}
      @media(max-width:650px){.sticker-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.sticker-figure img{max-width:165px}.sticker-multi img{max-width:260px}}
    `;
    document.head.appendChild(estil);
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
