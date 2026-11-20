---
name: publicar-snack
description: Añadir, cambiar o retirar un snack en la sección «Snacks BARF» de barfeand.com (CA, ES y FR). Usar cuando se pida añadir un snack nuevo, cambiar el precio, el peso, la foto o el texto de un snack, o quitar uno («afegeix aquest snack»).
---

# Snacks BARF: añadir, cambiar o retirar un snack

Quien lo pide puede ser el desarrollador o la propietaria de El Rebost del Nord. Háblale en el idioma en que te escriba, de forma breve y sin tecnicismos. Lee antes el `CLAUDE.md` de la raíz.

Los snacks son **datos** (`datos/snacks.json`) y un script los convierte en HTML estático: las tarjetas de las tres páginas (`snacks-barf/`, `es/snacks-barf/`, `fr/snacks-barf/`) y el bloque breve de las tres portadas (los 3 primeros snacks). **Nunca toques ese HTML a mano.** El orden del archivo es el orden de la web.

## 1. Sincroniza

`git status` y `git pull`. Si hay cambios sin subir o conflictos, para y avisa.

## 2. Reúne lo necesario (pregunta solo lo que falte, todo en un mensaje)

- Nombre en **catalán, castellano y francés**, empezando siempre por «Snack» (p. ej. «Snack Coll de Pollastre» / «Snack Cuello de pollo» / «Snack Cou de poulet»).
- **Animal** de origen: `pollastre`, `gall-indi`, `vedella`, `xai`, `porc` o `conill` (da el color de la tarjeta).
- **Peso** (`70 g`) y **precio** (`3,00 €`), los mismos que en la tienda.
- **Ingrediente** y 2-3 frases de descripción. Opcional: un **aviso** («Important») si hace falta (p. ej. el hígado, por la vitamina A).
- **Ficha de la tienda** en catalán (`https://elrebostdelnord.com/producte/…/`) y en castellano (`https://elrebostdelnord.com/es/producto-3/…/`). El francés enlaza a la castellana (la tienda no tiene francés). Comprueba que las dos abren.
- **Foto**: la URL de la foto de la ficha de la tienda (`https://elrebostdelnord.com/wp-content/uploads/…webp`) con su ancho y alto en píxeles.

## 3. Reglas de contenido (obligatorias)

- **«Snack» es nombre propio**: nunca «aperitiu», «aperitivo», «golosina», «llaminadura», «tentempié» ni «friandise». En castellano se dice «premio»; en francés, «récompense».
- «El Rebost del Nord» y «BARFEAND» no se traducen nunca.
- **Nada de afirmaciones médicas.** Usa «natural». Nada de «cura», «previene», «tracta»… «Ajuda a la higiene dental» sí.
- **No digas que el pollo es bueno para estómagos sensibles** (es una alergia frecuente en perros). El conejo y la vedella sí pueden serlo, si la propietaria lo confirma.
- Nunca «complet» ni «complementari».
- Catalán con apóstrofo tipográfico (’). En francés, el script pone el espacio fino antes de `:` `;` `!` `?`.
- La recomendación común («És un snack, no un àpat…») y la información de la línea (un sol ingredient, monoproteics, sense gluten, conservació) ya están en la página: no la repitas en cada snack.

## 4. Enséñale el borrador y espera su «ok»

Muéstrale los textos en su idioma. **No publiques sin su aprobación explícita.**

## 5. Monta el snack

Añade la entrada en `datos/snacks.json` (dentro de `"snacks": [...]`):

```json
{
  "id": "coll-pollastre",
  "animal": "pollastre",
  "peso": "70 g",
  "precio": "3,00 €",
  "foto": { "src": "https://elrebostdelnord.com/wp-content/uploads/2026/11/snack-pollastre-coll-deshidratat.webp", "ancho": 900, "alto": 900 },
  "tienda": {
    "ca": "https://elrebostdelnord.com/producte/coll-pollastre-deshidratat/",
    "es": "https://elrebostdelnord.com/es/producto-3/coll-pollastre-deshidratat/"
  },
  "textos": {
    "ca": { "nombre": "Snack Coll de Pollastre", "ingrediente": "coll de pollastre deshidratat.", "descripcion": "…", "aviso": "" },
    "es": { "nombre": "Snack Cuello de pollo", "ingrediente": "cuello de pollo deshidratado.", "descripcion": "…" },
    "fr": { "nombre": "Snack Cou de poulet", "ingrediente": "cou de poulet déshydraté.", "descripcion": "…" }
  }
}
```

- `id`: en minúsculas con guiones; es el ancla de la tarjeta (`/snacks-barf/#snack-ID`).
- `aviso` es opcional (vacío u omitido = sin aviso).
- La foto también puede ser local (`imagenes/snacks/…webp`).

Genera: `node .claude/skills/publicar-snack/generar_snacks.js`. Si algo no cumple las reglas (falta un idioma, precio mal escrito, enlace que no es de la tienda, palabra prohibida…), **no escribe nada** y dice qué falta: corrígelo en los datos, nunca en el HTML. Si va bien, actualiza las páginas, las portadas y el `lastmod` en `sitemap.xml`.

## 6. Comprueba y publica

1. `git status`: solo deben cambiar `datos/snacks.json`, las páginas de snacks, las portadas y `sitemap.xml`.
2. Commit en castellano: `Snacks: <nombre del snack>`, con el pie de autoría que indique la sesión.
3. `git pull --rebase` y `git push origin main`. Si hay conflictos, para y avisa.
4. Espera 2–3 minutos y comprueba en `https://barfeand.com/snacks-barf/` que sale la tarjeta, que se ve la foto y que el botón «Comprar» abre la ficha correcta (también en `/es/` y `/fr/`).

## Retirar un snack

Borra su entrada de `datos/snacks.json`, ejecuta el script y publica con el commit `Snacks: retirado <nombre>`.
