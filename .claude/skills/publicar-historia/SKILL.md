---
name: publicar-historia
description: Publicar una historia real de un cliente y su perro o gato en «Històries i experiències BARFEAND» de barfeand.com (CA, ES y FR). Usar cuando se pida publicar, añadir o subir una historia, una experiencia o un testimonio de una familia («publica aquesta història»).
---

# Publicar una historia en «Històries i experiències BARFEAND»

Quien lo pide suele ser Roser o la propietaria de El Rebost del Nord, no el desarrollador. Háblale en el idioma en que te escriba, de forma breve y sin tecnicismos: nada de rutas, commits ni HTML en tus mensajes, salvo que pregunte. Lee antes el `CLAUDE.md` de la raíz: datos del negocio, recetas y reglas de contenido.

Las historias son **datos** (`datos/historias.json`) y un script las convierte en HTML estático (las tres páginas de historias y el bloque de las portadas). **Nunca toques el diseño ni el HTML a mano**: añade la entrada y las fotos y ejecuta el script.

## 1. Sincroniza

`git status` y `git pull`. Si hay cambios sin subir o conflictos, para y avisa de que el desarrollador tiene que revisarlo.

## 2. Reúne lo necesario (pregunta solo lo que falte, todo en un mensaje)

Obligatorio:
- **Nombre de cada animal** que sale en las fotos o en el vídeo, y si es perro o gato.
- **Permiso para la web** (sí/no) y **permiso para Instagram** (sí/no), con la fecha en que lo dieron. Sin permiso para la web **no se publica**.
- Si la persona **autoriza que salga su nombre** (y cuál). Si no, no sale ningún nombre de persona.
- **Cómo era antes** y **qué han notado ahora**, con sus palabras, y una **frase** suya para destacar.
- **Fotos** suyas (mejor horizontales y hechas con el móvil en casa).
- Si ha recibido el **obsequi** (10 % y Pack Regal): sí/no.

Opcional: receta que come (`pollastre`, `gall-indi`, `vedella`, `xai`, `porc`, `conill`, `multiproteina` o vacío), raza, edad, mes y año desde que come BARFEAND, enlace al reel de Instagram (solo si hay permiso para Instagram) y si es la historia **destacada**.

## 3. Reglas de contenido (obligatorias)

- **Nunca inventes ni completes una historia.** Usa solo lo que ha dicho la familia. Puedes corregir ortografía y acortar, sin cambiar el sentido. Si falta algo, pregúntalo.
- **Nada de promesas de salud ni afirmaciones médicas** («li ha curat…», «ya no tiene alergia»). Solo lo que han notado («menja amb més ganes», «té el pèl més brillant»). Si la familia habla de una enfermedad o de un tratamiento, quítalo o pregúntale si se puede decir de otra forma.
- Nunca digas que BARFEAND es «complet» ni «complementari». Si la frase de la familia lo dice, pídele permiso para quitar esa palabra.
- **Traducción:** escribe los textos en catalán, castellano y francés, con el mismo tono y sin añadir nada. Catalán con apóstrofo tipográfico (’). En francés, espacio fino o no separable antes de `?`, `!`, `:` y `;`. Nombres de recetas como en `CLAUDE.md`. «Pack Regal» no se traduce.
- Los **vídeos no se suben a la web**: solo se enlaza el reel de Instagram.
- Las fotos solo de la familia. Nunca de internet.

## 4. Enséñale el borrador y espera su «ok»

Muéstrale los textos en el idioma en que te escribe (nombres, antes, ahora, frase, receta y si sale su nombre). Aplica sus cambios. **No publiques sin su aprobación explícita.** Si la familia tiene que ver la historia antes (paso 3 de la web: «Te l’ensenyem abans»), recuérdaselo.

## 5. Monta la historia

1. **Id:** nombres de los animales + año y mes, en minúsculas y con guiones (p. ej. `luna-rocky-2026-11`).
2. **Fotos:** por cada foto, `python3 .claude/skills/publicar-historia/preparar_foto.py FOTO ID N` (N = 1, 2…). Crea `imagenes/historias/ID-N.webp` (máx. 1200 px, sin datos de ubicación) y escribe la línea para `fotos`. La primera es la que sale en la web.
3. **Datos:** añade la entrada en `datos/historias.json` (dentro de `"historias": [...]`) con este formato:

```json
{
  "id": "luna-rocky-2026-11",
  "fecha": "2026-11-20",
  "animales": [
    { "nombre": "Luna", "especie": "gos", "raza": { "ca": "border collie", "es": "border collie", "fr": "border collie" }, "edad": { "ca": "4 anys", "es": "4 años", "fr": "4 ans" } },
    { "nombre": "Rocky", "especie": "gos" }
  ],
  "receta": "pollastre",
  "des_de": "2026-04",
  "textos": {
    "ca": { "abans": "…", "ara": "…", "frase": "…" },
    "es": { "abans": "…", "ara": "…", "frase": "…" },
    "fr": { "abans": "…", "ara": "…", "frase": "…" }
  },
  "persona": "Marta",
  "fotos": [ { "archivo": "imagenes/historias/luna-rocky-2026-11-1.webp", "ancho": 1200, "alto": 900 } ],
  "instagram": "",
  "destacada": true,
  "permiso": { "web": true, "instagram": false, "fecha": "2026-11-18" },
  "obsequi": true
}
```

   - `fecha`: hoy. `receta`, `des_de`, `raza`, `edad`, `persona` e `instagram` pueden ir vacíos (`""`) u omitirse. `raza` y `edad` pueden ser un texto o `{ "ca", "es", "fr" }`.
   - La frase va sin comillas: el script pone « ».
   - Solo una historia con `"destacada": true` (si marcas una nueva, quítaselo a la anterior). Sin ninguna destacada, todas salen en la rejilla.
   - Las fotos pueden llevar `"alt": { "ca": "…", "es": "…", "fr": "…" }`; si no, el texto alternativo es el nombre de los animales.
4. **Genera:** `node .claude/skills/publicar-historia/generar_historias.js`. Si algo no cumple las reglas (sin permiso, sin nombre, sin fotos, sin traducción…), el script **no escribe nada** y dice qué falta: corrígelo en los datos, nunca en el HTML. Si todo va bien, actualiza las tres páginas, el bloque de las tres portadas y el `lastmod` de esas URL en `sitemap.xml`.

## 6. Comprueba

- `git status`: solo deben cambiar `datos/historias.json`, las fotos nuevas, las páginas de historias, las portadas y `sitemap.xml`.
- Si puedes, captura la página en ordenador (1366 px) y en móvil (390 px).
- Que el texto no tenga promesas de salud ni datos que la familia no haya dado.

## 7. Publica

1. Commit en castellano: `Historias: <nombres de los animales>`, con el pie de autoría que indique la sesión.
2. `git pull --rebase` y `git push origin main`. Si hay conflictos, para y avisa.
3. Espera 2–3 minutos y comprueba que `https://barfeand.com/histories-i-experiencies/` muestra la historia.

## 8. Cuéntaselo

Dale el enlace de la página en su idioma. Recuérdale que envíe a la familia su código de descuento y que prepare el Pack Regal para su siguiente pedido, si no lo ha hecho ya.

## Retirar una historia

Si una familia retira el permiso: borra su entrada de `datos/historias.json` y sus fotos de `imagenes/historias/`, ejecuta el script y publica con el commit `Historias: retirada la de <nombres>`.
