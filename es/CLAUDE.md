# BARFEAND – Contexto para Claude

Lee este archivo antes de tocar nada. Responde siempre en castellano y de forma breve.

## Regla de oro (en cada sesión)

1. **Al empezar:** `git status` y `git pull`. Si hay cambios sin subir o conflictos, para y avisa.
2. **Al terminar:** lista los archivos cambiados, propón un mensaje de commit en castellano y haz (o recuerda) **commit + push**.
3. Se trabaja desde dos PC (uno se llama **PC piso**). GitHub es siempre la copia buena.

## Qué es el proyecto

- **BARFEAND** es la marca de alimentación BARF de **El Rebost del Nord** (carnicería en Andorra).
- Web estática (HTML, CSS y JS) en **https://barfeand.com**, publicada con **GitHub Pages** en cada push a `main` (`.github/workflows/deploy-pages.yml`).
- Idiomas: catalán (principal, en `/`), castellano (`/es/`) y francés (`/fr/`).
- **La compra se hace en la tienda WooCommerce de El Rebost del Nord** (elrebostdelnord.com). La web enlaza cada producto allí. No se monta tienda propia.
- El asistente **Barfy** (`assets/barfy/`) usa `api.barfeand.com`, que está en el hosting Webempresa. No tocar ese servidor.
- La carpeta `barfeand.com` del hosting Webempresa está vacía y no se usa. `barfear.com` redirige a barfeand.com con un `.htaccess`.

## Estructura

- `index.html`, `qui-som/` → catalán
- `es/index.html`, `es/quienes-somos/` y 6 guías en castellano: `es/que-es-la-dieta-barf/`, `es/como-empezar-dieta-barf/`, `es/cantidad-barf-perro-gato/`, `es/calculadora-barf/`, `es/comprar-barf-andorra/`, `es/preguntas-frecuentes-barf/`
- `fr/index.html`, `fr/qui-sommes-nous/` → francés
- `app/` → app de la calculadora (PWA, solo en catalán). Si cambias `app/index.html`, sube la versión de `CACHE_NAME` en `app/sw.js`.
- `css/estilos.css`, `css/mobile-v2.css`, `css/qui-som.css`, `css/guias.css` (guías)
- `js/principal.js` (menú, navegación) y `js/calculadora.js` (calculadora en los 3 idiomas)
- `sitemap.xml`, `robots.txt`

## Convenciones

- Si cambias un CSS o un JS, actualiza su `?v=` en todos los HTML que lo cargan.
- Las páginas nuevas se añaden a `sitemap.xml`. Después de publicar, se pide la indexación en Google Search Console (propiedad de dominio barfeand.com).
- Revisa los cambios en ordenador y en móvil antes de darlos por terminados.

## Datos del negocio (confirmados por el usuario el 6 de octubre de 2026)

- **Recetas:** pollo, pavo, ternera de Andorra, cordero, cerdo Duroc, conejo y multiproteína (pollo, ternera y cerdo). Proporción 60 % carne, 20 % hueso, 15 % vísceras y 5 % verdura y fruta.
- **Formatos:** todas las recetas en 1 kg y 500 g (también el conejo). Cada formato tiene su precio en la tienda.
- **IMPORTANTE:** las recetas **NO son una dieta completa**. Son un **alimento complementario** para perros y gatos. Se recomiendan complementos (ver la lista de abajo).
- **Entrega:** recogida en la carnicería y envío a domicilio en las zonas de Andorra configuradas en WooCommerce.
- **Composición analítica:** no es obligatoria en Andorra y no se publica. La etiqueta lleva información comercial, conservación (−18 °C), descongelación y caducidad.
- **Datos legales:** los mismos que El Rebost del Nord.
- **Punto de venta externo:** SÜNA, Av. del Pessebre 90, Escaldes-Engordany (colaborador, no es del usuario).
- **Contacto:** carnisseria@elrebostdelnord.com y WhatsApp +376 678 536. También vendemos a tiendas (mayoristas).

## Tarea urgente pendiente

Corregir los textos que presentan BARFEAND como dieta completa:

- `es/como-empezar-dieta-barf/`: quitar "hasta llegar al 100 %" y explicar cómo incorporarlo junto con los complementos.
- `es/cantidad-barf-perro-gato/`, `es/calculadora-barf/` y `js/calculadora.js`: presentar los gramos como cantidad orientativa de BARF dentro de su alimentación.
- `es/preguntas-frecuentes-barf/` (también su JSON-LD FAQPage) y `es/que-es-la-dieta-barf/`.
- Portadas CA/ES/FR y app: revisar la frase de la calculadora.
- Texto base **aprobado por el usuario** (6 de octubre de 2026): *"BARFEAND es un alimento complementario para perros y gatos. Para una alimentación equilibrada, complétalo con los suplementos recomendados (como aceites ricos en omega 3) y consulta con tu veterinario."*

## Complementos recomendados (propuesta para la web)

Basados en las prácticas habituales de alimentación BARF. Siempre con la indicación de consultar con el veterinario y seguir la dosis del fabricante.

- **Esenciales:** aceite de pescado (omega 3: EPA y DHA), vitamina E (cuando se da omega 3) y, en gatos, taurina.
- **Recomendados:** fuente de yodo (alga kelp, con dosis muy controlada), mejillón de labio verde (articulaciones; aporta zinc y manganeso), levadura de cerveza o nutricional (vitaminas B) y huevo crudo (1 por semana por cada 10 kg).
- **Opcionales:** kéfir o yogur natural (probióticos), espirulina, caldo de huesos y psyllium (fibra).
- **No mencionar** en la web dosis concretas de vitamina D ni de kelp: el exceso es perjudicial. Remitir siempre al veterinario.

## Plan de trabajo (resumen)

1. **Base para vender:** páginas legales, aviso de cookies, Google Analytics, menú unificado y la corrección de "alimento complementario".
2. **Fichas de producto:** una página por receta, con fotos, ingredientes, formatos, conservación y botón a la tienda. Sin composición analítica.
3. **Compra práctica:** calculadora que lleve al carrito, packs y complementos recomendados.
4. **Idiomas completos:** guías y fichas en catalán y francés, y app de la calculadora en castellano y francés.
5. **Confianza y captación:** Perfil de Empresa de Google, reseñas, WhatsApp visible y formulario de mayoristas.
6. **Crecimiento continuo:** una guía nueva al mes y revisión mensual de Search Console y Analytics.

Plan completo: https://claude.ai/code/artifact/6629b502-997d-419f-a52e-39a8d00e061b
