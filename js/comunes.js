"use strict";

/*
 * Comú a totes les pàgines BARFEAND:
 * - Google Analytics 4 amb Consent Mode v2 (tot denegat per defecte).
 * - Avís de galetes propi (Acceptar / Rebutjar) que desa l'elecció.
 * - Botó flotant de WhatsApp.
 * - Esdeveniments: clic_comprar, uso_calculadora, clic_whatsapp i clic_telefono.
 * S'ha de carregar al <head>, sense defer, abans de qualsevol altre script.
 */
(() => {
  const ID_GA = "G-8SJNE52H4V";
  const CLAU_ELECCIO = "barfeand-galetes";
  const VALIDESA_ELECCIO = 365 * 24 * 60 * 60 * 1000;
  const WHATSAPP = "376678536";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  const gtag = window.gtag;

  function llegirEleccio() {
    try {
      const desada = JSON.parse(localStorage.getItem(CLAU_ELECCIO) || "null");
      if (!desada || !["acceptat", "rebutjat"].includes(desada.estat)) return null;
      if (Date.now() - desada.data > VALIDESA_ELECCIO) return null;
      return desada.estat;
    } catch (error) {
      return null;
    }
  }

  function desarEleccio(estat) {
    try {
      localStorage.setItem(CLAU_ELECCIO, JSON.stringify({ estat, data: Date.now() }));
    } catch (error) {
      /* Sense emmagatzematge, l'avís tornarà a sortir a la pàgina següent. */
    }
  }

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "denied",
    wait_for_update: 500
  });

  let eleccio = llegirEleccio();
  if (eleccio === "acceptat") gtag("consent", "update", { analytics_storage: "granted" });

  gtag("js", new Date());
  gtag("config", ID_GA);

  const scriptGa = document.createElement("script");
  scriptGa.async = true;
  scriptGa.src = `https://www.googletagmanager.com/gtag/js?id=${ID_GA}`;
  document.head.appendChild(scriptGa);

  const idioma = (document.documentElement.lang || "ca").slice(0, 2).toLowerCase();
  const textos = {
    ca: {
      etiqueta: "Avís de galetes",
      titol: "Galetes d’analítica",
      text: "Fem servir Google Analytics per saber com s’utilitza la web i millorar-la. Només activem aquestes galetes si les acceptes.",
      enllac: "Política de galetes",
      politica: "/politica-de-galetes/",
      acceptar: "Acceptar",
      rebutjar: "Rebutjar",
      whatsapp: "Escriu-nos per WhatsApp",
      missatge: "Hola! Tinc una consulta sobre BARFEAND."
    },
    es: {
      etiqueta: "Aviso de cookies",
      titol: "Cookies de analítica",
      text: "Usamos Google Analytics para saber cómo se utiliza la web y mejorarla. Solo activamos estas cookies si las aceptas.",
      enllac: "Política de cookies",
      politica: "/es/politica-de-cookies/",
      acceptar: "Aceptar",
      rebutjar: "Rechazar",
      whatsapp: "Escríbenos por WhatsApp",
      missatge: "¡Hola! Tengo una consulta sobre BARFEAND."
    },
    fr: {
      etiqueta: "Bandeau cookies",
      titol: "Cookies de mesure d’audience",
      text: "Nous utilisons Google Analytics pour comprendre l’utilisation du site et l’améliorer. Ces cookies ne sont activés que si vous les acceptez.",
      enllac: "Politique de cookies",
      politica: "/fr/politique-de-cookies/",
      acceptar: "Accepter",
      rebutjar: "Refuser",
      whatsapp: "Écrivez-nous sur WhatsApp",
      missatge: "Bonjour ! J’ai une question sur BARFEAND."
    }
  };
  const t = textos[idioma] || textos.ca;

  const ICONA_WHATSAPP = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';

  let avis = null;

  function crearAvis() {
    avis = document.createElement("section");
    avis.className = "cookie-banner";
    avis.hidden = true;
    avis.setAttribute("aria-label", t.etiqueta);
    avis.innerHTML = `
      <div>
        <p class="cookie-banner__title">${t.titol}</p>
        <p class="cookie-banner__text">${t.text} <a href="${t.politica}">${t.enllac}</a>.</p>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__button" data-galetes="rebutjar">${t.rebutjar}</button>
        <button type="button" class="cookie-banner__button cookie-banner__button--accept" data-galetes="acceptar">${t.acceptar}</button>
      </div>`;
    document.body.appendChild(avis);
  }

  function mostrarAvis(ambFocus) {
    if (!avis) return;
    avis.hidden = false;
    if (ambFocus) avis.querySelector("button")?.focus();
  }

  function esborrarGaletesGa() {
    const domini = location.hostname.replace(/^www\./, "");
    document.cookie.split(";")
      .map((galeta) => galeta.split("=")[0].trim())
      .filter((nom) => nom === "_ga" || nom.startsWith("_ga_"))
      .forEach((nom) => {
        ["", `; domain=${domini}`, `; domain=.${domini}`].forEach((ambit) => {
          document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${ambit}`;
        });
      });
  }

  function aplicarEleccio(estat) {
    eleccio = estat;
    desarEleccio(estat);
    gtag("consent", "update", { analytics_storage: estat === "acceptat" ? "granted" : "denied" });
    if (estat === "rebutjat") esborrarGaletesGa();
    if (avis) avis.hidden = true;
  }

  function afegirWhatsApp() {
    if (document.querySelector(".whatsapp-float")) return;
    const enllac = document.createElement("a");
    enllac.className = "whatsapp-float";
    enllac.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.missatge)}`;
    enllac.target = "_blank";
    enllac.rel = "noopener noreferrer";
    enllac.title = t.whatsapp;
    enllac.setAttribute("aria-label", t.whatsapp);
    enllac.innerHTML = ICONA_WHATSAPP;
    document.body.appendChild(enllac);
  }

  function ubicacio(element) {
    if (element.closest(".whatsapp-float")) return "boton_flotante";
    if (element.closest(".header")) return "cabecera";
    if (element.closest(".product-card")) return "producto";
    if (element.closest("footer")) return "pie";
    return "contenido";
  }

  function registrarEnllac(enllac) {
    let url;
    try {
      url = new URL(enllac.href, location.href);
    } catch (error) {
      return;
    }

    if (url.protocol === "tel:") {
      gtag("event", "clic_telefono", { telefono: url.pathname, ubicacion: ubicacio(enllac), idioma });
      return;
    }

    if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) {
      gtag("event", "clic_whatsapp", { ubicacion: ubicacio(enllac), idioma });
      return;
    }

    if (url.hostname.endsWith("elrebostdelnord.com") && /^\/(?:es\/)?(?:producte|producto|categoria)\//.test(url.pathname)) {
      const targeta = enllac.closest(".product-card");
      const producte = targeta?.dataset.labelName || targeta?.querySelector("h3")?.textContent?.trim() || "tienda";
      gtag("event", "clic_comprar", { producto: producte, ubicacion: ubicacio(enllac), link_url: url.href, idioma });
    }
  }

  function gestionarClic(event) {
    const element = event.target.closest?.("a, button");
    if (!element) return;

    if (element.dataset.galetes === "acceptar") return aplicarEleccio("acceptat");
    if (element.dataset.galetes === "rebutjar") return aplicarEleccio("rebutjat");
    if (element.hasAttribute("data-obrir-galetes")) return mostrarAvis(true);
    if (element.tagName === "A") registrarEnllac(element);
  }

  function gestionarFormulari(event) {
    const formulari = event.target;
    if (!(formulari instanceof HTMLFormElement) || formulari.id !== "formulari-calculadora") return;
    if (!formulari.checkValidity()) return;

    const valor = (id) => formulari.querySelector(`#${id}`)?.value || "";
    gtag("event", "uso_calculadora", {
      especie: valor("especie"),
      etapa: valor("etapa"),
      actividad: valor("activitat"),
      objetivo: valor("objectiu"),
      peso_kg: Number.parseFloat(valor("pes")) || 0,
      idioma
    });
  }

  function iniciar() {
    if (document.querySelector(".mobile-quick-nav")) document.body.classList.add("has-quick-nav");
    afegirWhatsApp();
    crearAvis();
    if (!eleccio) mostrarAvis(false);
    document.addEventListener("click", gestionarClic);
    document.addEventListener("submit", gestionarFormulari);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
