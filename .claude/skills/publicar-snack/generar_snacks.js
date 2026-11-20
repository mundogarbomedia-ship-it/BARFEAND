#!/usr/bin/env node
/*
 * Genera la sección «Snacks BARF» a partir de datos/snacks.json.
 *
 * Uso (desde la raíz del repositorio):
 *   node .claude/skills/publicar-snack/generar_snacks.js [--datos RUTA] [--sin-sitemap]
 *
 * Rellena el HTML estático entre las marcas <!-- snacks:inicio --> y <!-- snacks:fin -->
 * de las tres páginas de snacks (las tarjetas) y de las tres portadas (el bloque breve).
 * No toca nada fuera de las marcas. Si algún snack no cumple las reglas, no escribe nada.
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
const RUTA_DATOS = opcion("--datos") || path.join("datos", "snacks.json");
const SIN_SITEMAP = args.includes("--sin-sitemap");

const MARCA_INICIO = "<!-- snacks:inicio -->";
const MARCA_FIN = "<!-- snacks:fin -->";
const IDIOMAS = ["ca", "es", "fr"];

// Animal de origen (snacks monoproteicos): color de la receta y nombre en cada idioma.
const ANIMALES = {
  pollastre: { color: "#FFD01A", ca: "Pollastre", es: "Pollo", fr: "Poulet" },
  "gall-indi": { color: "#62D7E1", ca: "Gall d’indi", es: "Pavo", fr: "Dinde" },
  vedella: { color: "#EF2525", ca: "Vedella", es: "Ternera", fr: "Veau" },
  xai: { color: "#278A2B", ca: "Xai", es: "Cordero", fr: "Agneau" },
  porc: { color: "#FF8D78", ca: "Porc", es: "Cerdo", fr: "Porc" },
  conill: { color: "#9C50DF", ca: "Conill", es: "Conejo", fr: "Lapin" }
};

// «Snack» es nombre propio: estas palabras no se usan nunca. Tampoco «complet» ni «complementari».
const PROHIBIDAS = /\b(aperitius?|aperitivos?|golosinas?|llaminadur\w*|tentempi\w*|friandises?|complets?|completos?|complementari\w*|complementario\w*|complémentaire\w*)\b/i;

const T = {
  ca: {
    pagina: "/snacks-barf/",
    ingrediente: "Ingredient",
    importante: "Important",
    comprar: "Comprar",
    comprarAria: (n) => `Comprar ${n} a El Rebost del Nord`,
    alt: (n, p) => `${n}, paquet de ${p}`,
    buit: "Aviat hi haurà els primers snacks. Mentrestant, els pots veure a la botiga.",
    botiga: "Veure els snacks a la botiga",
    categoria: "https://elrebostdelnord.com/categoria/menjar-barf-a-andorra/snacks-barf/",
    inicioLema: "Snacks BARF",
    inicioTitulo: "Premia’l amb un snack natural",
    inicioTexto: "Un sol ingredient, deshidratat lentament, sense additius ni conservants. Monoproteics, perquè encaixin amb la seva recepta BARF.",
    inicioEnlace: "Veure tots els snacks",
    recomanacio: "És un snack, no un àpat. Dona’l sempre sota supervisió, en una mida adequada per al teu gos i amb aigua fresca a l’abast."
  },
  es: {
    pagina: "/es/snacks-barf/",
    ingrediente: "Ingrediente",
    importante: "Importante",
    comprar: "Comprar",
    comprarAria: (n) => `Comprar ${n} en El Rebost del Nord`,
    alt: (n, p) => `${n}, paquete de ${p}`,
    buit: "Pronto estarán aquí los primeros snacks. Mientras tanto, puedes verlos en la tienda.",
    botiga: "Ver los snacks en la tienda",
    categoria: "https://elrebostdelnord.com/es/categoria/menjar-barf-a-andorra/snacks-barf/",
    inicioLema: "Snacks BARF",
    inicioTitulo: "Prémialo con un snack natural",
    inicioTexto: "Un solo ingrediente, deshidratado lentamente, sin aditivos ni conservantes. Monoproteicos, para que encajen con su receta BARF.",
    inicioEnlace: "Ver todos los snacks",
    recomanacio: "Es un snack, no una comida. Dáselo siempre bajo supervisión, en un tamaño adecuado para tu perro y con agua fresca a su alcance."
  },
  fr: {
    pagina: "/fr/snacks-barf/",
    ingrediente: "Ingrédient",
    importante: "Important",
    comprar: "Acheter",
    comprarAria: (n) => `Acheter ${n} chez El Rebost del Nord`,
    alt: (n, p) => `${n}, sachet de ${p}`,
    buit: "Les premiers snacks arrivent bientôt. En attendant, vous pouvez les voir dans la boutique.",
    botiga: "Voir les snacks dans la boutique",
    categoria: "https://elrebostdelnord.com/es/categoria/menjar-barf-a-andorra/snacks-barf/",
    inicioLema: "Snacks BARF",
    inicioTitulo: "Récompensez-le avec un snack naturel",
    inicioTexto: "Un seul ingrédient, déshydraté lentement, sans additifs ni conservateurs. Monoprotéiques, pour s’accorder avec sa recette BARF.",
    inicioEnlace: "Voir tous les snacks",
    recomanacio: "C’est un snack, pas un repas. Donnez-le toujours sous surveillance, dans une taille adaptée à votre chien et avec de l’eau fraîche à disposition."
  }
};

const ARCHIVOS = [
  { archivo: "snacks-barf/index.html", lang: "ca", tipo: "pagina", url: "https://barfeand.com/snacks-barf/" },
  { archivo: "es/snacks-barf/index.html", lang: "es", tipo: "pagina", url: "https://barfeand.com/es/snacks-barf/" },
  { archivo: "fr/snacks-barf/index.html", lang: "fr", tipo: "pagina", url: "https://barfeand.com/fr/snacks-barf/" },
  { archivo: "index.html", lang: "ca", tipo: "inicio", url: "https://barfeand.com/" },
  { archivo: "es/index.html", lang: "es", tipo: "inicio", url: "https://barfeand.com/es/" },
  { archivo: "fr/index.html", lang: "fr", tipo: "inicio", url: "https://barfeand.com/fr/" }
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// En francés, espacio fino no separable antes de : ; ! ?
const tipografia = (s, lang) => (lang === "fr" ? String(s).replace(/[ \u00a0]([:;!?])/g, "\u202f$1") : String(s));
const tx = (s, lang) => esc(tipografia(String(s).trim(), lang));
const tienda = (sn, lang) => (lang === "ca" ? sn.tienda.ca : sn.tienda.es);
const srcFoto = (f) => (/^https?:\/\//.test(f.src) ? f.src : "/" + f.src.replace(/^\//, ""));

function validar(snacks) {
  const errores = [];
  const ids = new Set();
  snacks.forEach((sn, i) => {
    const nom = sn && sn.id ? `«${sn.id}»` : `n.º ${i + 1}`;
    const err = (m) => errores.push(`Snack ${nom}: ${m}`);
    if (!sn.id || !/^[a-z0-9-]+$/.test(sn.id)) err("falta el id o no está en minúsculas con guiones.");
    else if (ids.has(sn.id)) err("id repetido.");
    ids.add(sn.id);
    if (!ANIMALES[sn.animal]) err(`animal desconocido «${sn.animal}» (usa ${Object.keys(ANIMALES).join(", ")}).`);
    if (!/^\d+([,.]\d+)? ?(g|kg)$/.test(sn.peso || "")) err("falta el peso (p. ej. «70 g»).");
    if (!/^\d+,\d{2} €$/.test(sn.precio || "")) err("falta el precio con el formato «3,00 €».");
    const f = sn.foto || {};
    if (!f.src) err("falta la foto.");
    else if (!/^https?:\/\//.test(f.src) && !fs.existsSync(path.join(RAIZ, f.src.replace(/^\//, "")))) err(`no existe la foto ${f.src}.`);
    if (!(f.ancho > 0 && f.alto > 0)) err("faltan el ancho y el alto de la foto.");
    const t = sn.tienda || {};
    if (!/^https:\/\/elrebostdelnord\.com\/producte\//.test(t.ca || "")) err("tienda.ca tiene que ser una ficha https://elrebostdelnord.com/producte/….");
    if (!/^https:\/\/elrebostdelnord\.com\/es\/producto(-\d+)?\//.test(t.es || "")) err("tienda.es tiene que ser una ficha https://elrebostdelnord.com/es/producto-3/….");
    IDIOMAS.forEach((l) => {
      const x = sn.textos && sn.textos[l];
      ["nombre", "ingrediente", "descripcion"].forEach((c) => { if (!x || !String(x[c] || "").trim()) err(`falta textos.${l}.${c}.`); });
      if (x && !/^Snack /.test(String(x.nombre || "").trim())) err(`textos.${l}.nombre tiene que empezar por «Snack ».`);
      if (x) Object.entries(x).forEach(([c, v]) => {
        const m = String(v).match(PROHIBIDAS);
        if (m) err(`textos.${l}.${c} usa «${m[0]}»: «Snack» no se traduce y no se dice completo ni complementario.`);
      });
    });
  });
  return errores;
}

function imagen(sn, lang, extra) {
  const f = sn.foto;
  const nombre = sn.textos[lang].nombre.trim();
  const alt = (f.alt && f.alt[lang]) || T[lang].alt(nombre, sn.peso);
  return `<img src="${esc(srcFoto(f))}" width="${f.ancho}" height="${f.alto}" alt="${esc(alt)}" loading="lazy" decoding="async"${extra || ""}>`;
}

function tarjeta(sn, lang) {
  const t = T[lang];
  const x = sn.textos[lang];
  const a = ANIMALES[sn.animal];
  const nombre = x.nombre.trim();
  const aviso = x.aviso && String(x.aviso).trim()
    ? `\n            <p class="sn-warning"><strong>${t.importante}${lang === "fr" ? "\u202f:" : ":"}</strong> ${tx(x.aviso, lang)}</p>`
    : "";
  return `<article id="snack-${sn.id}" class="sn-card" style="--c:${a.color}">
          <div class="sn-card__media">${imagen(sn, lang)}<span class="sn-tag"><span class="sn-dot"></span>${esc(a[lang])}</span></div>
          <div class="sn-card__body">
            <h3>${esc(nombre)}</h3>
            <p class="sn-price"><strong>${esc(sn.precio)}</strong><span class="sn-weight">${esc(sn.peso)}</span></p>
            <p class="sn-ingredient"><strong>${t.ingrediente}${lang === "fr" ? "\u202f:" : ":"}</strong> ${tx(x.ingrediente, lang)}</p>
            <p class="sn-text">${tx(x.descripcion, lang)}</p>${aviso}
            <a class="button button--wide sn-buy" href="${esc(tienda(sn, lang))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t.comprarAria(nombre))}">${t.comprar}</a>
          </div>
        </article>`;
}

function bloquePagina(snacks, lang) {
  const t = T[lang];
  if (!snacks.length) {
    return `<div class="sn-empty"><p>${esc(t.buit)}</p><a class="button" href="${t.categoria}" target="_blank" rel="noopener noreferrer">${esc(t.botiga)}</a></div>`;
  }
  return `<div class="sn-grid">
        ${snacks.map((sn) => tarjeta(sn, lang)).join("\n        ")}
      </div>`;
}

function bloqueInicio(snacks, lang) {
  if (!snacks.length) return "";
  const t = T[lang];
  const mini = snacks.slice(0, 3).map((sn) => {
    const a = ANIMALES[sn.animal];
    return `<a class="pt-snack" href="${t.pagina}#snack-${sn.id}" style="--c:${a.color}"><span class="pt-snack__media">${imagen(sn, lang)}</span><span class="pt-snack__body"><span class="pt-snack__name">${esc(sn.textos[lang].nombre.trim())}</span><span class="pt-snack__meta">${esc(sn.peso)} · <strong>${esc(sn.precio)}</strong></span></span></a>`;
  });
  return `<section id="snacks" class="pt-section pt-snacks" aria-labelledby="titol-snacks"><div class="container">
    <div class="pt-snacks__head">
      <div><p class="eyebrow">${t.inicioLema}</p><h2 id="titol-snacks">${esc(t.inicioTitulo)}</h2><p class="pt-snacks__intro">${tx(t.inicioTexto, lang)}</p></div>
      <a class="button button--outline pt-snacks__link" href="${t.pagina}">${esc(t.inicioEnlace)}</a>
    </div>
    <div class="pt-snacks__grid">
      ${mini.join("\n      ")}
    </div>
    <p class="pt-snacks__note">${tx(t.recomanacio, lang)}</p>
  </div></section>`;
}

function main() {
  const datos = JSON.parse(fs.readFileSync(path.resolve(RAIZ, RUTA_DATOS), "utf8"));
  const snacks = Array.isArray(datos.snacks) ? datos.snacks : [];
  const errores = validar(snacks);
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
    const contenido = a.tipo === "pagina" ? bloquePagina(snacks, a.lang) : bloqueInicio(snacks, a.lang);
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

  console.log(`${snacks.length} snack(s) publicado(s).`);
  console.log(cambiadas.length ? "Archivos actualizados:\n- " + cambiadas.map((a) => a.archivo).join("\n- ") : "Sin cambios.");
}

main();
