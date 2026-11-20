#!/usr/bin/env python3
"""Optimiza una foto de una historia de BARFEAND para la web.

Uso (desde la raíz del repositorio):
    python3 .claude/skills/publicar-historia/preparar_foto.py FOTO ID N

FOTO  foto original (jpg, png, webp o heic convertido), tal como la ha enviado la familia.
ID    id de la historia, en minúsculas y con guiones (p. ej. luna-rocky-2026-11).
N     número de la foto dentro de la historia (1 = la principal).

Crea imagenes/historias/ID-N.webp (como mucho 1200 px de ancho, sin datos EXIF ni GPS)
y escribe la entrada para la lista «fotos» de datos/historias.json.
"""
import json
import os
import sys

from PIL import Image, ImageOps

SALIDA = os.path.join("imagenes", "historias")
ANCHO_MAX = 1200


def main():
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    foto, id_historia, numero = sys.argv[1:]
    if not os.path.isdir("imagenes"):
        sys.exit("Ejecuta el script desde la raíz del repositorio (no encuentro imagenes/).")
    os.makedirs(SALIDA, exist_ok=True)

    # exif_transpose gira la foto según el móvil; al guardar sin exif se eliminan la ubicación y los datos del móvil.
    img = ImageOps.exif_transpose(Image.open(foto)).convert("RGB")
    if img.width > ANCHO_MAX:
        img = img.resize((ANCHO_MAX, round(img.height * ANCHO_MAX / img.width)), Image.LANCZOS)
    if img.width < 800:
        print(f"AVISO: la foto mide solo {img.width} px de ancho; se verá pequeña. Pide una más grande si es posible.")

    ruta = os.path.join(SALIDA, f"{id_historia}-{numero}.webp")
    img.save(ruta, "WEBP", quality=80, method=6)
    entrada = {"archivo": ruta.replace(os.sep, "/"), "ancho": img.width, "alto": img.height}
    print(f"{ruta}  {img.width}x{img.height}  {os.path.getsize(ruta) // 1024} KB")
    print(json.dumps(entrada, ensure_ascii=False))


if __name__ == "__main__":
    main()
