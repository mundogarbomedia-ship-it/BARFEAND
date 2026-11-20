#!/usr/bin/env node
/*
 * Genera la sección «Històries i experiències BARFEAND» a partir de datos/historias.json.
 *
 * Uso (desde la raíz del repositorio):
 *   node .claude/skills/publicar-historia/generar_historias.js [--datos RUTA] [--sin-sitemap]
 *
 * Rellena el HTML estático entre las marcas <!-- historias:inicio --> y <!-- historias:fin -->
 * de las tres páginas de historias y de las tres portadas. No toca nada fuera de las marcas.
 * Si alguna historia no cumple las reglas (permiso, nombre del animal, fotos…), no escribe nada.
 * Cada historia puede ser un «abans/ara» (abans, ara y frase) o un momento (solo un texto corto),
 * con fotos, con un vídeo corto (mp4, máx. 10 MB, sin reproducción automática) o con las dos cosas.
 * Con cambios, pone la fecha de hoy en el lastmod de esas URL en sitemap.xml.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const RAIZ = process.cwd();
const args = process.argv.slice(2);
const opcion = (nombre) => {
  const i = args.indexOf(nombre);
  return i === -1 ? null : args[i + 1];
};
const RUTA_DATOS = opcion("--datos") || path.join("datos", "historias.json");
const SIN_SITEMAP = args.includes("--sin-sitemap");

const MARCA_INICIO = "<!-- historias:inicio -->";
const MARCA_FIN = "<!-- historias:fin -->";

const RECETAS = {
  pollastre: { color: "#FFD01A", ca: "Pollastre", es: "Pollo", fr: "Poulet", menjaCa: "pollastre", menjaEs: "pollo", menjaFr: "du poulet" },
  "gall-indi": { color: "#62D7E1", ca: "Gall d’indi", es: "Pavo", fr: "Dinde", menjaCa: "gall d’indi", menjaEs: "pavo", menjaFr: "de la dinde" },
  vedella: { color: "#EF2525", ca: "Vedella d’Andorra", es: "Ternera de Andorra", fr: "Veau d’Andorre", menjaCa: "vedella d’Andorra", menjaEs: "ternera de Andorra", menjaFr: "du veau d’Andorre" },
  xai: { color: "#278A2B", ca: "Xai", es: "Cordero", fr: "Agneau", menjaCa: "xai", menjaEs: "cordero", menjaFr: "de l’agneau" },
  porc: { color: "#FF8D78", ca: "Porc Duroc", es: "Cerdo Duroc", fr: "Porc Duroc", menjaCa: "porc Duroc", menjaEs: "cerdo Duroc", menjaFr: "du porc Duroc" },
  conill: { color: "#9C50DF", ca: "Conill", es: "Conejo", fr: "Lapin", menjaCa: "conill", menjaEs: "conejo", menjaFr: "du lapin" },
  multiproteina: { color: "#161516", ca: "Multiproteïna", es: "Multiproteína", fr: "Multiprotéines", menjaCa: "multiproteïna", menjaEs: "multiproteína", menjaFr: "la recette multiprotéines" }
};
const ORDEN_RECETAS = Object.keys(RECETAS);
const KRAFT = "#C9A57A";
const VIDEO_MAX_MB = 10;

const MESES = {
  ca: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
};

const T = {
  ca: {
    pagina: "/histories-i-experiencies/",
    compartir: "#explica",
    especie: { gos: "Gos", gat: "Gat" },
    y: " i ",
    desde: (mes, any) => `des ${/^[aeiouàèéíòóú]/i.test(mes) ? "d’" : "de "}${mes} de ${any}`,
    come: (plural) => (plural ? "Mengen BARFEAND" : "Menja BARFEAND"),
    comeReceta: (plural, r) => `${plural ? "mengen" : "menja"} ${r.menjaCa}`,
    abans: "Abans",
    ara: "Ara",
    permiso: "Publicada amb permís de la família",
    obsequi: "La família ha rebut un obsequi per compartir-la",
    instagram: "Veure el vídeo a Instagram",
    video: "Vídeo",
    totes: "Totes",
    filtro: "Filtra per recepta",
    mas: "Més històries",
    llegir: "Abans i ara",
    buit: "Encara estem recollint les primeres històries. Vols que la del teu gos o el teu gat sigui una de les primeres?",
    botonCompartir: "Explica’ns la teva història",
    inicioLema: "Ho expliquen les famílies",
    inicioTitulo: "Històries i experiències BARFEAND",
    inicioEnlace: "Veure totes les històries"
  },
  es: {
    pagina: "/es/historias-y-experiencias/",
    compartir: "#cuentanos",
    especie: { gos: "Perro", gat: "Gato" },
    y: " y ",
    desde: (mes, any) => `desde ${mes} de ${any}`,
    come: (plural) => (plural ? "Comen BARFEAND" : "Come BARFEAND"),
    comeReceta: (plural, r) => `${plural ? "comen" : "come"} ${r.menjaEs}`,
    abans: "Antes",
    ara: "Ahora",
    permiso: "Publicada con permiso de la familia",
    obsequi: "La familia ha recibido un obsequio por compartirla",
    instagram: "Ver el vídeo en Instagram",
    video: "Vídeo",
    totes: "Todas",
    filtro: "Filtrar por receta",
    mas: "Más historias",
    llegir: "Antes y ahora",
    buit: "Todavía estamos recogiendo las primeras historias. ¿Quieres que la de tu perro o tu gato sea una de las primeras?",
    botonCompartir: "Cuéntanos tu historia",
    inicioLema: "Lo cuentan las familias",
    inicioTitulo: "Historias y experiencias BARFEAND",
    inicioEnlace: "Ver todas las historias"
  },
  fr: {
    pagina: "/fr/histoires-et-experiences/",
    compartir: "#racontez",
    especie: { gos: "Chien", gat: "Chat" },
    y: " et ",
    desde: (mes, any) => `depuis ${mes} ${any}`,
    come: (plural) => (plural ? "Mangent BARFEAND" : "Mange BARFEAND"),
    comeReceta: (plural, r) => `${plural ? "mangent" : "mange"} ${r.menjaFr}`,
    abans: "Avant",
    ara: "Maintenant",
    permiso: "Publiée avec l’autorisation de la famille",
    obsequi: "La famille a reçu un cadeau pour l’avoir partagée",
    instagram: "Voir la vidéo sur Instagram",
    video: "Vidéo",
    totes: "Toutes",
    filtro: "Filtrer par recette",
    mas: "Plus d’histoires",
    llegir: "Avant et maintenant",
    buit: "Nous recueillons encore les premières histoires. Vous voulez que celle de votre chien ou de votre chat soit l’une des premières ?",
    botonCompartir: "Racontez-nous votre histoire",
    inicioLema: "Ce sont les familles qui le racontent",
    inicioTitulo: "Histoires et expériences BARFEAND",
    inicioEnlace: "Voir toutes les histoires"
  }
};

const ARCHIVOS = [
  { archivo: "histories-i-experiencies/index.html", lang: "ca", tipo: "pagina", url: "https://barfeand.com/histories-i-experiencies/" },
  { archivo: "es/historias-y-experiencias/index.html", lang: "es", tipo: "pagina", url: "https://barfeand.com/es/historias-y-experiencias/" },
  { archivo: "fr/histoires-et-experiences/index.html", lang: "fr", tipo: "pagina", url: "https://barfeand.com/fr/histoires-et-experiences/" },
  { archivo: "index.html", lang: "ca", tipo: "inicio", url: "https://barfeand.com/" },
  { archivo: "es/index.html", lang: "es", tipo: "inicio", url: "https://barfeand.com/es/" },
  { archivo: "fr/index.html", lang: "fr", tipo: "inicio", url: "https://barfeand.com/fr/" }
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const texto = (valor, lang) => (valor && typeof valor === "object" ? valor[lang] || "" : valor || "");
const sinComillas = (s) => String(s).trim().replace(/^[«"“]+|[»"”]+$/g, "").trim();

function validar(historias) {
  const errores = [];
  const ids = new Set();
  historias.forEach((h, i) => {
    const nom = h && h.id ? `«${h.id}»` : `n.º ${i + 1}`;
    const err = (m) => errores.push(`Historia ${nom}: ${m}`);
    if (!h.id || !/^[a-z0-9-]+$/.test(h.id)) err("falta el id o no está en minúsculas con guiones.");
    else if (ids.has(h.id)) err("id repetido.");
    ids.add(h.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(h.fecha || "")) err("falta la fecha de publicación (AAAA-MM-DD).");
    if (!Array.isArray(h.animales) || !h.animales.length) err("falta al menos un animal.");
    else h.animales.forEach((a) => {
      if (!a || !String(a.nombre || "").trim()) err("hay un animal sin nombre.");
      if (!["gos", "gat"].includes(a && a.especie)) err(`la especie de ${(a && a.nombre) || "un animal"} tiene que ser «gos» o «gat».`);
    });
    if (h.receta && !RECETAS[h.receta]) err(`receta desconocida «${h.receta}» (usa ${ORDEN_RECETAS.join(", ")} o vacío).`);
    if (h.des_de && !/^\d{4}-(0[1-9]|1[0-2])$/.test(h.des_de)) err("des_de tiene que ser AAAA-MM.");
    ["ca", "es", "fr"].forEach((l) => {
      const t = h.textos && h.textos[l];
      const hay = (c) => !!(t && String(t[c] || "").trim());
      if (!t || !(hay("text") || hay("frase") || hay("abans") || hay("ara"))) err(`falta textos.${l} (como mínimo «text», o «abans», «ara» y «frase»).`);
      else if (hay("abans") !== hay("ara")) err(`textos.${l}: «abans» y «ara» van juntos (los dos o ninguno).`);
    });
    if (!h.permiso || h.permiso.web !== true || !/^\d{4}-\d{2}-\d{2}$/.test(h.permiso.fecha || "")) err("no tiene permiso registrado para la web (permiso.web = true y permiso.fecha). No se publica.");
    const existe = (archivo) => fs.existsSync(path.join(RAIZ, String(archivo).replace(/^\//, "")));
    if (h.video) {
      const v = h.video;
      if (!v.archivo || !/\.mp4$/i.test(v.archivo)) err("el vídeo tiene que ser un archivo .mp4.");
      else if (!existe(v.archivo)) err(`no existe el vídeo ${v.archivo}.`);
      else if (fs.statSync(path.join(RAIZ, v.archivo.replace(/^\//, ""))).size > VIDEO_MAX_MB * 1024 * 1024) err(`el vídeo ${v.archivo} pasa de ${VIDEO_MAX_MB} MB: recórtalo o enlaza el reel de Instagram.`);
      if (!v.portada || !existe(v.portada)) err("falta la portada del vídeo (video.portada) o no existe.");
      if (!(v.ancho > 0 && v.alto > 0)) err("faltan el ancho y el alto del vídeo (los de la portada).");
    }
    if (h.fotos !== undefined && !Array.isArray(h.fotos)) err("«fotos» tiene que ser una lista.");
    if (!(Array.isArray(h.fotos) && h.fotos.length) && !h.video) err("falta al menos una foto o un vídeo.");
    else (Array.isArray(h.fotos) ? h.fotos : []).forEach((f) => {
      if (!f || !f.archivo) return err("hay una foto sin archivo.");
      if (!existe(f.archivo)) err(`no existe la foto ${f.archivo}.`);
      if (!(f.ancho > 0 && f.alto > 0)) err(`faltan el ancho y el alto de ${f.archivo}.`);
    });
    if (h.enlace) ["ca", "es", "fr"].forEach((l) => {
      const e = h.enlace[l];
      if (e && !(/^(\/|https:\/\/)/.test(e.url || "") && String(e.texto || "").trim())) err(`enlace.${l} necesita «url» (que empiece por / o https://) y «texto».`);
    });
    if (h.instagram && !/^https:\/\/(www\.)?instagram\.com\//.test(h.instagram)) err("el enlace de Instagram no es de instagram.com.");
    if (h.instagram && !(h.permiso && h.permiso.instagram === true)) err("tiene enlace de Instagram pero no permiso para Instagram.");
  });
  return errores;
}

function nombres(h, lang) {
  const n = h.animales.map((a) => a.nombre.trim());
  return n.length > 1 ? `${n.slice(0, -1).join(", ")}${T[lang].y}${n[n.length - 1]}` : n[0];
}

function lineaAnimal(a, lang, varios) {
  const partes = [T[lang].especie[a.especie], texto(a.raza, lang), texto(a.edad, lang)].filter(Boolean);
  return varios ? [a.nombre.trim(), ...partes].join(" · ") : partes.join(" · ");
}

function desde(h, lang) {
  if (!h.des_de) return "";
  const [any, mes] = h.des_de.split("-").map(Number);
  return `${T[lang].come(h.animales.length > 1)} ${T[lang].desde(MESES[lang][mes - 1], any)}`;
}

const ruta = (archivo) => "/" + String(archivo).replace(/^\//, "");
const fotos = (h) => (Array.isArray(h.fotos) ? h.fotos : []);

function img(f, alt) {
  return `<img src="${esc(ruta(f.archivo))}" width="${f.ancho}" height="${f.alto}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}

// Imagen de la tarjeta de la portada: la primera foto o, si solo hay vídeo, su portada.
function imagen(h, lang) {
  const f = fotos(h)[0];
  if (f) return img(f, texto(f.alt, lang) || nombres(h, lang));
  return img({ archivo: h.video.portada, ancho: h.video.ancho, alto: h.video.alto }, nombres(h, lang));
}

// Medio principal de la ficha: el vídeo (sin reproducción automática) o la primera foto.
function medio(h, lang) {
  if (!h.video) return imagen(h, lang);
  const v = h.video;
  return `<video class="hs-video" controls playsinline preload="none" poster="${esc(ruta(v.portada))}" width="${v.ancho}" height="${v.alto}" aria-label="${esc(`${T[lang].video}: ${nombres(h, lang)}`)}"><source src="${esc(ruta(v.archivo))}" type="video/mp4"></video>`;
}

// Las demás fotos (todas si el medio principal es el vídeo).
function galeria(h, lang) {
  const resto = h.video ? fotos(h) : fotos(h).slice(1);
  if (!resto.length) return "";
  return `<div class="hs-gallery">${resto.map((f) => img(f, texto(f.alt, lang) || nombres(h, lang))).join("")}</div>`;
}

const hay = (h, lang, c) => !!String((h.textos[lang] || {})[c] || "").trim();
const textoCorto = (h, lang) => (hay(h, lang, "text") ? `<p class="hs-text">${esc(h.textos[lang].text.trim())}</p>` : "");

function enlace(h, lang) {
  const e = h.enlace && h.enlace[lang];
  return e ? `<a class="hs-link" href="${esc(e.url)}">${esc(e.texto.trim())}</a>` : "";
}

function etiqueta(h, lang) {
  const r = RECETAS[h.receta];
  return r ? `<span class="hs-tag"><span class="hs-dot" style="--c:${r.color}"></span>${esc(r[lang])}</span>` : "";
}

function datos(h, lang) {
  const varios = h.animales.length > 1;
  const lineas = h.animales.map((a) => lineaAnimal(a, lang, varios)).filter(Boolean);
  const d = desde(h, lang);
  return (lineas.length ? `<ul class="hs-animals">${lineas.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : "") +
    (d ? `<p class="hs-since">${esc(d)}</p>` : "");
}

function pie(h, lang) {
  const t = T[lang];
  const partes = [h.persona && String(h.persona).trim(), t.permiso, h.obsequi ? t.obsequi : ""].filter(Boolean).map(esc);
  const ig = h.instagram ? `<a class="hs-ig" href="${esc(h.instagram)}" target="_blank" rel="noopener noreferrer">${t.instagram}</a>` : "";
  return `<p class="hs-meta">${partes.join(" · ")}</p>${ig}`;
}

function antesAhora(h, lang) {
  if (!hay(h, lang, "abans")) return "";
  const tx = h.textos[lang];
  return `<div class="hs-ba"><div class="hs-ba__abans"><h4>${T[lang].abans}</h4><p>${esc(tx.abans.trim())}</p></div>` +
    `<div class="hs-ba__ara"><h4>${T[lang].ara}</h4><p>${esc(tx.ara.trim())}</p></div></div>`;
}

const frase = (h, lang) => !hay(h, lang, "frase") ? "" : `<blockquote class="hs-quote"><p>«${esc(sinComillas(h.textos[lang].frase))}»</p></blockquote>`;
const color = (h) => (RECETAS[h.receta] ? RECETAS[h.receta].color : KRAFT);

const partes = (lista, sep) => lista.filter(Boolean).join(sep);

function destacada(h, lang) {
  return `<article id="historia-${h.id}" class="hs-story hs-featured" data-receta="${h.receta || ""}" style="--c:${color(h)}">
        <div class="hs-featured__media${h.video ? " hs-featured__media--video" : ""}">${medio(h, lang)}</div>
        <div class="hs-featured__body">
          ${partes([etiqueta(h, lang) + `<h3>${esc(nombres(h, lang))}</h3>`, datos(h, lang), textoCorto(h, lang), antesAhora(h, lang), frase(h, lang), galeria(h, lang), pie(h, lang) + enlace(h, lang)], "\n          ")}
        </div>
      </article>`;
}

function tarjeta(h, lang) {
  return `<article id="historia-${h.id}" class="hs-story hs-card" data-receta="${h.receta || ""}" style="--c:${color(h)}">
          ${medio(h, lang)}
          <div class="hs-card__body">
            ${partes([etiqueta(h, lang) + `<h3>${esc(nombres(h, lang))}</h3>`, datos(h, lang), textoCorto(h, lang), frase(h, lang), hay(h, lang, "abans") ? `<details class="hs-more-text"><summary>${T[lang].llegir}</summary>${antesAhora(h, lang)}</details>` : "", galeria(h, lang), pie(h, lang) + enlace(h, lang)], "\n            ")}
          </div>
        </article>`;
}

function ordenar(historias) {
  return [...historias].sort((a, b) => b.fecha.localeCompare(a.fecha) || a.id.localeCompare(b.id));
}

function bloquePagina(historias, lang) {
  const t = T[lang];
  if (!historias.length) {
    return `<div class="hs-empty"><p>${esc(t.buit)}</p><a class="button" href="${t.compartir}">${esc(t.botonCompartir)}</a></div>`;
  }
  const lista = ordenar(historias);
  const principal = lista.find((h) => h.destacada === true);
  const resto = lista.filter((h) => h !== principal);
  let html = "";
  if (lista.length >= 2) {
    const usadas = ORDEN_RECETAS.filter((id) => lista.some((h) => h.receta === id));
    html += `<div class="hs-filter" role="group" aria-label="${t.filtro}">` +
      `<button type="button" class="hs-filter__btn" data-receta="" aria-pressed="true">${t.totes}</button>` +
      usadas.map((id) => `<button type="button" class="hs-filter__btn" data-receta="${id}" aria-pressed="false"><span class="hs-dot" style="--c:${RECETAS[id].color}"></span>${esc(RECETAS[id][lang])}</button>`).join("") +
      `</div>\n      `;
  }
  if (principal) html += destacada(principal, lang);
  if (resto.length) {
    html += `\n      <div class="hs-more">${principal ? `<h2 class="hs-more__title">${t.mas}</h2>` : ""}
        <div class="hs-grid">
          ${resto.map((h) => tarjeta(h, lang)).join("\n          ")}
        </div>
      </div>`;
  }
  return html;
}

function bloqueInicio(historias, lang) {
  if (!historias.length) return "";
  const t = T[lang];
  const lista = ordenar(historias);
  const principal = lista.find((h) => h.destacada === true);
  const tres = (principal ? [principal, ...lista.filter((h) => h !== principal)] : lista).slice(0, 3);
  const tarjetas = tres.map((h) => {
    const r = RECETAS[h.receta];
    const meta = r ? `${nombres(h, lang)} · ${t.comeReceta(h.animales.length > 1, r)}` : nombres(h, lang);
    return `<a class="pt-historia" href="${t.pagina}#historia-${h.id}" style="--c:${color(h)}">${imagen(h, lang)}<span class="pt-historia__body">${hay(h, lang, "frase") ? `<span class="pt-historia__quote">«${esc(sinComillas(h.textos[lang].frase))}»</span>` : `<span class="pt-historia__quote">${esc(h.textos[lang].text.trim())}</span>`}<span class="pt-historia__meta">${esc(meta)}</span></span></a>`;
  });
  return `<section class="pt-section pt-historias" aria-labelledby="titol-historias"><div class="container">
    <p class="pt-historias__lema">${t.inicioLema}</p>
    <h2 id="titol-historias">${t.inicioTitulo}</h2>
    <div class="pt-historias__grid">
      ${tarjetas.join("\n      ")}
    </div>
    <a class="pt-historias__link" href="${t.pagina}">${t.inicioEnlace}</a>
  </div></section>`;
}

function main() {
  const datosJson = JSON.parse(fs.readFileSync(path.resolve(RAIZ, RUTA_DATOS), "utf8"));
  const historias = Array.isArray(datosJson.historias) ? datosJson.historias : [];
  const errores = validar(historias);
  if (errores.length) {
    console.error("No se ha generado nada. Corrige esto en " + RUTA_DATOS + ":\n- " + errores.join("\n- "));
    process.exit(1);
  }

  const cambiadas = [];
  for (const a of ARCHIVOS) {
    const ruta = path.join(RAIZ, a.archivo);
    const html = fs.readFileSync(ruta, "utf8");
    const i = html.indexOf(MARCA_INICIO);
    const f = html.indexOf(MARCA_FIN);
    if (i === -1 || f === -1 || f < i) {
      console.error(`Faltan las marcas ${MARCA_INICIO} / ${MARCA_FIN} en ${a.archivo}.`);
      process.exit(1);
    }
    const sangria = (html.slice(0, i).match(/[ \t]*$/) || [""])[0];
    const nl = html.includes("\r\n") ? "\r\n" : "\n";
    const contenido = a.tipo === "pagina" ? bloquePagina(historias, a.lang) : bloqueInicio(historias, a.lang);
    const medio = contenido ? nl + sangria + contenido.replace(/\r?\n/g, nl) + nl + sangria : nl + sangria;
    const nuevo = html.slice(0, i + MARCA_INICIO.length) + medio + html.slice(f);
    if (nuevo !== html) {
      fs.writeFileSync(ruta, nuevo);
      cambiadas.push(a);
    }
  }

  if (cambiadas.length && !SIN_SITEMAP) {
    const hoy = new Date().toISOString().slice(0, 10);
    const rutaSitemap = path.join(RAIZ, "sitemap.xml");
    let sitemap = fs.readFileSync(rutaSitemap, "utf8");
    for (const a of cambiadas) {
      const patron = new RegExp(`(<loc>${a.url.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}</loc>\\s*<lastmod>)[^<]*`);
      sitemap = sitemap.replace(patron, `$1${hoy}`);
    }
    fs.writeFileSync(rutaSitemap, sitemap);
  }

  console.log(`${historias.length} historia(s) publicada(s).`);
  console.log(cambiadas.length ? "Archivos actualizados:\n- " + cambiadas.map((a) => a.archivo).join("\n- ") : "Sin cambios.");
}

main();
