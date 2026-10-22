# BARFEAND – Contexto para Claude

Lee este archivo antes de tocar nada. Responde siempre en castellano y de forma breve.

## Regla de oro (en cada sesión)

1. **Al empezar:** `git status` y `git pull`. Si hay cambios sin subir o conflictos, para y avisa.
2. **Al terminar:** lista los archivos cambiados, propón un mensaje de commit en castellano y haz **commit + push** a `main` tras cada modificación.
3. Se trabaja desde dos PC (uno se llama **PC piso**). GitHub es siempre la copia buena.
4. **Repositorio compartido** (varias personas y cuentas de Claude suben a `main`):
   - Justo antes de cada push, `git pull --rebase` para traer lo que hayan subido otros mientras trabajabas.
   - Si hay conflicto, para y avisa; no resuelvas a ciegas cambios de otra persona.
   - Nunca `git push --force` ni reescribir historial de `main`.
   - Haz commits pequeños y frecuentes (uno por cambio), así se pisan menos.

## Qué es el proyecto

- **BARFEAND** es la marca de alimentación BARF de **El Rebost del Nord** (carnicería en Andorra).
- Web estática (HTML, CSS y JS) en **https://barfeand.com**, publicada con **GitHub Pages** en cada push a `main` (`.github/workflows/deploy-pages.yml`).
- Idiomas: catalán (principal, en `/`), castellano (`/es/`) y francés (`/fr/`).
- **La compra se hace en la tienda WooCommerce de El Rebost del Nord** (elrebostdelnord.com). La web enlaza cada producto allí. No se monta tienda propia.
- El asistente **Barfy** (`assets/barfy/`) usa `api.barfeand.com`, que está en el hosting Webempresa. No tocar ese servidor. Las respuestas se generan con la **API de Gemini de Google** (Google AI Studio, proyecto «BARFEAND-Barfy», facturación de pago Nivel 1): Google no usa los mensajes para mejorar sus productos. Así consta en las políticas de privacidad.
- La carpeta `barfeand.com` del hosting Webempresa está vacía y no se usa. `barfear.com` redirige a barfeand.com con un `.htaccess`.

## Estructura

- `index.html`, `qui-som/` → catalán
- `es/index.html`, `es/quienes-somos/` y 6 guías en castellano: `es/que-es-la-dieta-barf/`, `es/como-empezar-dieta-barf/`, `es/cantidad-barf-perro-gato/`, `es/calculadora-barf/`, `es/comprar-barf-andorra/`, `es/preguntas-frecuentes-barf/`
- `fr/index.html`, `fr/qui-sommes-nous/` → francés
- **Páginas legales** (enlazadas entre idiomas con `hreflang`, `x-default` = catalán):

  | | Catalán | Castellano | Francés |
  |---|---|---|---|
  | Aviso legal | `avis-legal/` | `es/aviso-legal/` | `fr/mentions-legales/` |
  | Privacidad | `politica-de-privacitat/` | `es/politica-de-privacidad/` | `fr/politique-de-confidentialite/` |
  | Cookies | `politica-de-galetes/` | `es/politica-de-cookies/` | `fr/politique-de-cookies/` |
  | Condiciones de venta | `condicions-de-venda/` | `es/condiciones-de-venta/` | `fr/conditions-de-vente/` |

- **Blog (8 de octubre de 2026):** `blog/` (catalán) y `es/blog/` (castellano), enlazados con `hreflang` (`x-default` = catalán). Cada artículo va en su carpeta: `blog/<slug-ca>/` y `es/blog/<slug-es>/`. Primer artículo: `blog/gos-actiu-tardor-andorra/` ↔ `es/blog/perro-activo-otono-andorra/`. Sin versión francesa todavía (desde el blog el botón FR lleva a `/fr/`). Estilos en `css/blog.css` (después de `guias.css`). «Blog» está en el menú CA y ES, entre «Preguntes/Preguntas» y «Qui som/Quiénes somos».
  - **Pensado para Google Discover:** todas las páginas llevan `<meta name="robots" content="max-image-preview:large">` (debajo del `canonical`). Cada artículo necesita: imagen grande propia (mínimo 1200 px de ancho) en `imagenes/blog/` con versiones `-16x9.jpg`, `-4x3.jpg` y `-1x1.jpg` (para el JSON-LD `BlogPosting` y `og:image`) más `-1600.webp` y `-800.webp` para la página; fecha de publicación visible y en `datePublished`; titular claro sin clickbait; el texto aprobado de «Cómo describir BARFEAND» (comida natural cruda + suplementos y veterinario); enlaces a la calculadora y a las recetas.
  - **Para publicar un artículo usa la skill `.claude/skills/publicar-blog/`** (pasos, reglas de contenido y script de imágenes). La propietaria del comercio publica directamente en `main` con su propia cuenta de Claude, después de aprobar el borrador.
  - Al publicar un artículo: añadir su tarjeta (la más nueva primero) y su entrada en `blogPost` del JSON-LD en los dos índices del blog, añadirlo a `sitemap.xml` y pedir la indexación en Search Console.
- `app/` → app de la calculadora (PWA, solo en catalán). Si cambias `app/index.html`, sube la versión de `CACHE_NAME` en `app/sw.js`.
- `css/estilos.css`, `css/mobile-v2.css`, `css/qui-som.css`, `css/guias.css` (guías y páginas legales) y `css/comunes.css` (aviso de cookies, botón de WhatsApp y enlaces legales del pie)
- **Portadas (diseño comercial, 8 de octubre de 2026):** las tres portadas cargan además `css/portada.css` (clases `pt-*`). Orden: franja negra (envío, recogida, WhatsApp) → vídeo con un solo mensaje y «Comprar ara · des de 4,20 €» (multiproteïna de 500 g) → franja de confianza → productos en cuadrícula (cada tarjeta muestra primero el formato de 500 g, seleccionado, y luego 1 kg; filtros Totes/Mono/Multi en `principal.js`; el ancla `#gammes` apunta a los filtros) → calculadora en fondo oscuro → «Com funciona» → «Què és BARF» → (ES: guías) → preguntas. Las tarjetas mantienen las clases que usan los JS (`product-card`, `product-photo`, `price`, `format`, `label-button`, `perkg` e `ingredients` ocultos). Sin barra de navegación inferior en móvil: Barfy ocupa la esquina, así que el botón «Comprar» va en la cabecera (`pt-header-buy`). Pendiente: sección de reseñas cuando haya opiniones reales de Google y fotos reales de los paquetes.
- `js/principal.js` (menú, navegación; marca solo el enlace del menú de la página actual), `js/calculadora.js` (calculadora en los 3 idiomas) y `js/comunes.js` (GA4, aviso de cookies, WhatsApp y eventos)
- `sitemap.xml`, `robots.txt`

## Elementos comunes a todas las páginas

- **`js/comunes.js`** va en el `<head>`, justo después del `viewport` y **sin `defer`** (tiene que fijar el consentimiento antes de cargar Google Analytics). Se encarga de:
  - **Google Analytics 4** (`G-8SJNE52H4V`) con **Consent Mode v2**: todo denegado por defecto. Al aceptar solo se concede `analytics_storage`; la publicidad queda siempre denegada.
  - **Aviso de cookies** propio en CA/ES/FR (Aceptar / Rechazar + enlace a la política de cookies). Guarda la elección en `localStorage` (`barfeand-galetes`) durante 12 meses. Al rechazar, borra las cookies `_ga`. Cualquier botón con `data-obrir-galetes` vuelve a abrir el aviso (está en el pie y en la política de cookies).
  - **Botón flotante de WhatsApp** (+376 678 536), abajo a la izquierda porque Barfy ocupa la derecha. En móvil sube por encima de la barra de navegación rápida.
  - **Eventos GA4:** `clic_comprar` (enlaces a `/producte/` o `/categoria/` de elrebostdelnord.com; parámetros `producto` y `ubicacion`), `uso_calculadora` (`especie`, `etapa`, `actividad`, `objetivo`, `peso_kg`), `clic_whatsapp` y `clic_telefono`.
- **Menú:** idéntico en todas las páginas de cada idioma, con rutas absolutas. CA y FR enlazan a las secciones de su portada (`/#barf`, `/fr/#barf`…); ES enlaza a las guías (`/es/que-es-la-dieta-barf/`, `/es/calculadora-barf/`, `/es/preguntas-frecuentes-barf/`) y a `/es/#gammes` y `/es/#productes`. No pongas `aria-current` a mano en el menú: lo pone `principal.js`.
- **Pie:** correo, «Teléfono y WhatsApp» +376 678 536, «Tienda» +376 867 648 (fijo) y una fila `footer__legal` con los cuatro enlaces legales y «Configurar cookies».
- **Favicon (12 de octubre de 2026):** el avatar de la marca (perro y gato en blanco sobre círculo rosa #D2265F), sacado del logo original con la línea engrosada en los tamaños pequeños. Archivos: `favicon.ico` (16/32/48), `imagenes/logo/favicon-32.png`, `favicon-192.png` y `apple-touch-icon.png` (cuadrado rosa), y los iconos de `app/`. Cada página lleva las cuatro etiquetas (`ico`, 32, 192 y apple-touch) con `?v=20261012`; si cambia el icono, sube ese `?v=` en todas.
- **Marca 2.2 (13 de octubre de 2026):** fuentes Poppins (títulos, precios y botones), Inter (texto) y Lora cursiva (solo frases cortas de acento), con las variables `--font-title`, `--font-text` y `--font-accent` de `css/estilos.css`. Se sirven desde la propia web (`fuentes/` + `css/fuentes.css`, licencia OFL), **no desde Google Fonts**, para no enviar la IP de los visitantes a Google. Cabecera con el logo horizontal `imagenes/logo/logo-barfeand-horizontal.svg` (52 px; 46 px entre 1001 y 1100 px; 38 px en móvil) y «by El Rebost del Nord» debajo; la versión `-blanco.svg` es para fondos oscuros.
- Una página nueva necesita: `comunes.js` en el `<head>` seguido de los dos `preload` de fuentes y `fuentes.css`, `comunes.css`, las etiquetas del favicon, el menú de su idioma, el pie con `footer__legal` y su entrada en `sitemap.xml`.

## Convenciones

- Si cambias un CSS o un JS, actualiza su `?v=` en todos los HTML que lo cargan.
- Cada artículo nuevo (CA y ES) y cada página nueva se añade a `sitemap.xml` con su `lastmod` en el mismo commit en que se publica. `lastmod` = fecha del último commit que tocó su `index.html`; prioridades: portada CA 1.0, ES y FR 0.9; guías e índices del blog 0.8; artículos y «Quiénes somos» 0.7; app 0.6; legales 0.3; sin `changefreq`. Después de publicar, se pide la indexación en Google Search Console (propiedad de dominio barfeand.com).
- Revisa los cambios en ordenador y en móvil antes de darlos por terminados.

## Datos del negocio (confirmados por el usuario el 6 de octubre de 2026)

- **Recetas:** pollo, pavo, ternera de Andorra, cordero, cerdo Duroc, conejo y multiproteína (pollo, ternera y cerdo). Proporción 60 % carne, 20 % hueso, 15 % vísceras y 5 % verdura y fruta.
- **Formatos:** todas las recetas en 1 kg y 500 g (también el conejo). Cada formato tiene su precio en la tienda.
- **IMPORTANTE:** nunca decir que las recetas son una dieta «completa» ni un alimento «complementario». Son **comida natural cruda para perros y gatos**; se recomiendan suplementos (ver la lista de abajo) y consultar al veterinario. Ver «Cómo describir BARFEAND».
- **Entrega:** recogida en la carnicería y envío a domicilio en las zonas de Andorra configuradas en WooCommerce.
- **Composición analítica:** no es obligatoria en Andorra y no se publica. La etiqueta lleva información comercial, conservación (−18 °C), descongelación y caducidad.
- **Transición (22 de octubre de 2026):** siempre progresiva en 10 días, **también en perros**. Nunca decir que lo habitual (o la mayoría) es pasar de golpe. Texto base:
  - **CA:** «Et recomanem fer el canvi de manera progressiva en 10 dies, també en gossos: si es canvia de cop hi pot haver diarrees o rebuig del menjar. En gats, que solen ser més reticents, pot caldre anar encara més a poc a poc.»
  - **ES:** «Recomendamos hacer el cambio de forma progresiva en 10 días, también en perros: si se cambia de golpe pueden aparecer diarreas o rechazo de la comida. En gatos, que suelen ser más reticentes, puede hacer falta ir aún más despacio.»
  - **FR:** «Nous recommandons de faire la transition progressivement sur 10 jours, chez le chien aussi : un changement brutal peut provoquer des diarrhées ou un refus de la nourriture. Chez le chat, souvent plus réticent, il peut falloir aller encore plus lentement.»
- **Taurina en gatos (22 de octubre de 2026):**
  - **CA:** «Les nostres receptes porten cor, ric en taurina. En gats, consulta el teu veterinari si convé afegir-hi un suplement.»
  - **ES:** «Nuestras recetas llevan corazón, rico en taurina. En gatos, consulta con tu veterinario si conviene añadir un suplemento.»
  - **FR:** «Nos recettes contiennent du cœur, riche en taurine. Chez le chat, demandez à votre vétérinaire s’il convient d’ajouter un complément.»
- **Datos legales:** los mismos que El Rebost del Nord. Titular: **El Rebost del Nord**, NRT **F308823Z**, Av. Príncep Benlloch, 85, local 2, AD500 Andorra la Vella. Ley de protección de datos: **Llei 29/2021** (autoridad: APDA).
- **Tienda online:** términos en `elrebostdelnord.com/termes-i-condicions/` (ES: `/es/terminos-y-condiciones/`) y envíos en `/enviaments/` (ES: `/es/envios/`). No hay versión francesa: desde FR se enlaza la catalana.
- **Punto de venta externo:** SÜNA, Av. del Pessebre 90, Escaldes-Engordany (colaborador, no es del usuario).
- **Contacto:** carnisseria@elrebostdelnord.com, WhatsApp y móvil +376 678 536 y teléfono fijo de la tienda +376 867 648. También vendemos a tiendas (mayoristas).

## Cómo describir BARFEAND (criterio del 13 de octubre de 2026)

**Nunca decir completo ni complementario; describirlo como comida natural cruda para perros y gatos y recomendar suplementos y veterinario.** Sustituye al criterio de «alimento complementario» del 6 de octubre (aprobado por el responsable). Texto base en toda la web (avisos, `guide-callout` del blog, calculadora, app y páginas legales):

- **CA:** «BARFEAND és menjar natural cru per a gossos i gats. Per a una alimentació equilibrada, et recomanem afegir-hi els suplements adequats (com ara olis rics en omega 3) i consultar el teu veterinari.»
- **ES:** «BARFEAND es comida natural cruda para perros y gatos. Para una alimentación equilibrada, te recomendamos añadir los suplementos adecuados (como aceites ricos en omega 3) y consultar a tu veterinario.»
- **FR:** «BARFEAND est une alimentation naturelle crue pour chiens et chats. Pour une alimentation équilibrée, nous vous recommandons d’y ajouter les suppléments adaptés (comme les huiles riches en oméga 3) et de consulter votre vétérinaire.»

En la nota bajo los productos de las portadas (`.pt-note`) va además el lema en `<em>` (Lora cursiva) entre las dos frases. Un título sobre el tema se escribe «Un alimento natural crudo» (CA «Un menjar natural cru», FR «Une alimentation naturelle crue»).

## Complementos recomendados (propuesta para la web)

Basados en las prácticas habituales de alimentación BARF. Siempre con la indicación de consultar con el veterinario y seguir la dosis del fabricante.

- **Esenciales:** aceite de pescado (omega 3: EPA y DHA), vitamina E (cuando se da omega 3) y, en gatos, taurina.
- **Recomendados:** fuente de yodo (alga kelp, con dosis muy controlada), mejillón de labio verde (articulaciones; aporta zinc y manganeso), levadura de cerveza o nutricional (vitaminas B) y huevo crudo (1 por semana por cada 10 kg).
- **Opcionales:** kéfir o yogur natural (probióticos), espirulina, caldo de huesos y psyllium (fibra).
- **No mencionar** en la web dosis concretas de vitamina D ni de kelp: el exceso es perjudicial. Remitir siempre al veterinario.

## Plan de trabajo (resumen)

1. **Base para vender:** páginas legales, aviso de cookies, Google Analytics, menú unificado y el aviso de suplementos y veterinario (hoy con el criterio de «Cómo describir BARFEAND»). *Hecho el 6 de octubre de 2026* (también el botón flotante de WhatsApp). Pendiente: que un asesor revise los textos legales y confirmar cuánto tiempo guarda el servidor de Barfy los mensajes.
2. **Fichas de producto:** una página por receta, con fotos, ingredientes, formatos, conservación y botón a la tienda. Sin composición analítica.
3. **Compra práctica:** calculadora que lleve al carrito, packs y complementos recomendados.
4. **Idiomas completos:** guías y fichas en catalán y francés, y app de la calculadora en castellano y francés.
5. **Confianza y captación:** Perfil de Empresa de Google, reseñas, WhatsApp visible y formulario de mayoristas.
6. **Crecimiento continuo:** al menos un artículo nuevo en el blog (CA + ES) o una guía nueva al mes y revisión mensual de Search Console y Analytics.

Plan completo: https://claude.ai/code/artifact/6629b502-997d-419f-a52e-39a8d00e061b
