#!/usr/bin/env python3
"""Prepara la imagen de un artículo del blog BARFEAND en todos los tamaños.

Uso (desde la raíz del repositorio):
    python3 .claude/skills/publicar-blog/preparar_imagen.py FOTO NOMBRE [--centro 0.5]

FOTO    imagen original (jpg, png o webp), idealmente de 1200 px de ancho o más.
NOMBRE  nombre base en minúsculas y con guiones, p. ej. receta-conill-nova.
--centro posición horizontal del motivo principal entre 0 y 1 (0,5 = centro);
         se usa para recortar las versiones 4:3 y 1:1 sin cortar al animal.

Crea en imagenes/blog/:
    NOMBRE-16x9.jpg, NOMBRE-4x3.jpg, NOMBRE-1x1.jpg  (Google Discover, JSON-LD y redes)
    NOMBRE-1600.webp, NOMBRE-800.webp                (página del artículo y tarjeta del índice)
"""
import argparse
import os
import sys

from PIL import Image, ImageOps

SALIDA = os.path.join("imagenes", "blog")


def recortar(img, proporcion, centro_x):
    ancho, alto = img.size
    if ancho / alto > proporcion:
        nuevo_ancho, nuevo_alto = int(alto * proporcion), alto
    else:
        nuevo_ancho, nuevo_alto = ancho, int(ancho / proporcion)
    x = int(ancho * centro_x) - nuevo_ancho // 2
    x = max(0, min(ancho - nuevo_ancho, x))
    y = (alto - nuevo_alto) // 2
    return img.crop((x, y, x + nuevo_ancho, y + nuevo_alto))


def limitar(img, ancho_max):
    if img.width > ancho_max:
        alto = round(img.height * ancho_max / img.width)
        return img.resize((ancho_max, alto), Image.LANCZOS)
    return img


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("foto")
    p.add_argument("nombre")
    p.add_argument("--centro", type=float, default=0.5)
    a = p.parse_args()

    if not os.path.isdir(SALIDA):
        sys.exit("Ejecuta el script desde la raíz del repositorio (no encuentro imagenes/blog/).")

    img = ImageOps.exif_transpose(Image.open(a.foto)).convert("RGB")
    if img.width < 1200:
        print(f"AVISO: la foto mide {img.width} px de ancho. Google Discover pide al menos 1200 px; "
              "pide una foto más grande si es posible.")

    base = os.path.join(SALIDA, a.nombre)
    panoramica = limitar(recortar(img, 16 / 9, a.centro), 1920)
    panoramica.save(f"{base}-16x9.jpg", quality=82, optimize=True, progressive=True)
    limitar(recortar(img, 4 / 3, a.centro), 1440).save(f"{base}-4x3.jpg", quality=82, optimize=True, progressive=True)
    limitar(recortar(img, 1, a.centro), 1200).save(f"{base}-1x1.jpg", quality=82, optimize=True, progressive=True)
    limitar(panoramica, 1600).save(f"{base}-1600.webp", quality=80)
    limitar(panoramica, 800).save(f"{base}-800.webp", quality=80)

    for sufijo in ("16x9.jpg", "4x3.jpg", "1x1.jpg", "1600.webp", "800.webp"):
        ruta = f"{base}-{sufijo}"
        with Image.open(ruta) as i:
            print(f"{ruta}  {i.width}x{i.height}  {os.path.getsize(ruta) // 1024} KB")


if __name__ == "__main__":
    main()
