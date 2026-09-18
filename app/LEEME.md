# Calculadora BARFEAND — aplicació instal·lable

Aquesta carpeta publica la calculadora com una aplicació web instal·lable (PWA) a `https://barfeand.com/app/`.

- `index.html`: interfície i lògica de la calculadora.
- `manifest.webmanifest`: nom, colors i icones de la instal·lació.
- `sw.js`: funcionament sense connexió.
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` i `apple-touch-icon.png`: icones oficials de BARFEAND.

Quan es modifiqui la fórmula de `js/calculadora.js`, cal aplicar el mateix canvi a l’script inclòs a `app/index.html`. Si es canvien fitxers de l’aplicació, també cal actualitzar el nom de la memòria cau a `sw.js` perquè els dispositius instal·lats rebin la versió nova.
