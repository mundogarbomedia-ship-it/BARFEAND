---
name: publicar-blog
description: Escribir y publicar un artículo nuevo en el blog de barfeand.com (catalán y castellano). Usar cuando se pida publicar, escribir o subir un artículo, una entrada o una noticia al blog de BARFEAND.
---

# Publicar un artículo en el blog de BARFEAND

Quien lo pide suele ser la propietaria de El Rebost del Nord, no el desarrollador. Háblale en castellano, de forma breve y sin tecnicismos: nada de rutas, commits ni HTML en tus mensajes, salvo que pregunte. Lee antes el `CLAUDE.md` de la raíz: ahí están los datos del negocio, las recetas y las reglas de contenido.

Publica directamente en `main` (la web se actualiza sola en un par de minutos), **pero solo después de que ella apruebe el texto** (paso 4).

## 1. Sincroniza

`git status` y `git pull`. Si hay cambios sin subir o conflictos, para y avisa de que el desarrollador tiene que revisarlo.

## 2. Reúne lo necesario

- **Tema.** Si solo da una idea («algo sobre el conejo»), propón un titular y sigue.
- **Foto.** Lo ideal es una foto suya, horizontal y de 1200 px de ancho o más (producto, perro o gato comiendo, la carnicería). Si no tiene, usa una de `imagenes/web/` o `imagenes/video/barfeand-gos-gat-poster.webp` y díselo. **Nunca** uses fotos de internet ni de otras marcas.
- Pregunta solo lo que falte de verdad: como mucho una pregunta.

## 3. Escribe el artículo en catalán y castellano

Reglas de contenido (obligatorias):

- Tono cercano y práctico, desde «nuestra carnicería en Andorra la Vella». Entre 500 y 900 palabras, con 4–6 apartados `h2`.
- Titular claro, sin clickbait, de menos de 70 caracteres si es posible. Descripción de 140–160 caracteres.
- Incluye siempre, en un `guide-callout`, el texto aprobado de alimento complementario (en `CLAUDE.md`; en catalán, copia el de `index.html`).
- Nombres de recetas: pollo/pollastre, pavo/gall dindi, ternera de Andorra/vedella d’Andorra, cordero/xai, cerdo Duroc/porc Duroc, conejo/conill, multiproteína/multiproteïna. Formatos de 500 g y 1 kg.
- Nada de promesas de salud ni afirmaciones médicas. Para dosis, complementos o problemas de salud, remite siempre al veterinario. Nunca des dosis de vitamina D ni de kelp. No publiques composición analítica.
- No inventes datos (precios, premios, estudios, cifras). Si el artículo necesita un dato que no está en `CLAUDE.md`, pregúntalo.
- Enlaza a la calculadora (CA: `/#calculadora`; ES: `/es/calculadora-barf/`), a las recetas (`/#productes`, `/es/#productes`) y, al final, al WhatsApp `https://wa.me/376678536`.
- Catalán correcto con apóstrofo tipográfico (’).

## 4. Enséñale el borrador y espera su «ok»

Muéstrale el titular y el texto en castellano (y dile que también va en catalán). Aplica sus cambios. **No publiques sin su aprobación explícita.**

## 5. Monta las páginas

Slugs cortos, en minúsculas, sin acentos y con guiones: uno en catalán y otro en castellano.

1. **Imagen:** `python3 .claude/skills/publicar-blog/preparar_imagen.py FOTO NOMBRE --centro X` (X = posición horizontal del motivo, 0–1). Revisa visualmente el recorte 1:1.
2. **Páginas:** copia el artículo más reciente como plantilla (`blog/<slug>/index.html` y `es/blog/<slug>/index.html`) y cambia todo lo que sea del artículo:
   `<title>`, `description`, `canonical`, los tres `hreflang` (`x-default` = catalán), `og:*` (imagen `-16x9.jpg`, `og:image:alt`), `article:published_time`, el JSON-LD `BlogPosting` (headline, description, las tres imágenes, `datePublished`, `dateModified`, `mainEntityOfPage`), el `BreadcrumbList`, el selector de idioma (CA y ES apuntan al artículo del otro idioma), la miga de pan, la etiqueta (`Blog BARFEAND · Tema`), el `h1`, la entradilla, la fecha visible, los minutos de lectura (≈ palabras / 200), la imagen (`-1600.webp` y `-800.webp`, con `alt` descriptivo) y el cuerpo.
   La fecha es la de hoy con hora `09:00:00+02:00` (en invierno `+01:00`).
3. **Índices:** en `blog/index.html` y `es/blog/index.html` añade su tarjeta **la primera** (imagen `-800.webp`) y su entrada **la primera** en `blogPost` del JSON-LD.
4. **Enlaces cruzados:** en la sección «Sigue leyendo» del artículo nuevo puedes enlazar a artículos anteriores.
5. **Sitemap:** añade las dos URLs a `sitemap.xml` con la fecha de hoy y cambia `lastmod` de `/blog/` y `/es/blog/`.

## 6. Comprueba

- Que el JSON-LD se lee bien (`python3 -c "import json…"` sobre cada `<script type="application/ld+json">`) y que `sitemap.xml` es XML válido.
- Que existen todos los enlaces e imágenes locales.
- Si puedes, captura la página en ordenador (1366 px) y en móvil (390 px) y revisa que no haya desbordamientos.

## 7. Publica

1. Commit en castellano: `Blog: <titular en castellano>`, con el pie de autoría que indique la sesión.
2. `git push origin main`. Si falla por cambios remotos: `git pull --rebase` y vuelve a subir. Si hay conflictos, para y avisa.
3. Espera 2–3 minutos y comprueba que las dos URLs responden en barfeand.com.

## 8. Cuéntaselo y pide la indexación

Dale los dos enlaces. Recuérdale que pida la indexación en Google Search Console («Inspeccionar cualquier URL» → «Solicitar indexación») para las dos URLs del artículo y los dos índices del blog. Si en la sesión hay un navegador con su Search Console abierto, ofrécete a hacerlo tú y pide su confirmación antes de pulsar.
