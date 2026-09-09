"""One-off import of the owner's public product photographs and label scans.
Product facts and prices come only from data/catalogo.json, not from scraping.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps, ImageDraw
import io, json
ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://elrebostdelnord.com/wp-content/uploads/'
PHOTOS = {
 'pollastre-1000':'2026/09/pollastre_barf_1k.png', 'pollastre-500':'2026/09/polastre_500grs.png',
 'gall-indi-1000':'2026/09/gall_indi_1k.png', 'gall-indi-500':'2026/09/gall_indi_500grs.png',
 'vedella-1000':'2026/03/vedella_barf_1k.png', 'vedella-500':'2026/09/vedella-barf_500g.png',
 'xai-1000':'2026/03/xai_1kgs.png', 'xai-500':'2026/09/xai_500grs.png',
 'porc-1000':'2026/09/porc_barf_1k.png', 'porc-500':'2026/09/porc_barf_500grs.png',
 'conill-500':'2026/03/paquet_500_conill.png',
 'multiproteina-1000':'2026/09/multi_barf_1k.png', 'multiproteina-500':'2026/09/multi_barf_500.png'
}
LABELS = {
 'pollastre-1000':['2026/09/pollastre_-etiq_1kg-1024x683.png'],
 'gall-indi-1000':['2026/09/etiqueta_gall_indi_1kg-1024x683.png'],
 'vedella-1000':['2026/03/etiqueta_vedella_1Kgrs-1024x683.png'],
 'xai-1000':['2026/03/etiqueta_xai_1kgs-1024x683.png'],
 'porc-1000':['2026/04/etiqueta_porc_1k-1024x683.png'],
 'conill-500':['2026/03/etiquet-500-grs_conill_barf-1024x683.png'],
 'multiproteina-1000':['2026/09/etiqueta_-multi_1Kgrs-1024x683.png'],
 'pollastre-500':['2026/09/pollastre_500.png'],
 'gall-indi-500':['2026/09/etiqueta_gall_indi_500grs.png'],
 'vedella-500':['2026/09/etiqueta_vedella_500grs.png','2026/03/etiqueta_vedella_500grs.png'],
 'xai-500':['2026/09/etiqueta_xai_500grs.png','2026/03/etiqueta_xai_500grs.png'],
 'porc-500':['2026/09/etiqueta_porc_500grs.png','2026/04/etiqueta_porc_500grs.png'],
 'multiproteina-500':['2026/09/etiqueta_-multi_500grs.png']
}

def download(job):
    group, name, paths, required = job
    target = ROOT / f'imagenes/{group}/{name}.webp'
    target.parent.mkdir(parents=True, exist_ok=True)
    for path in paths:
        url = BASE + path
        try:
            req = Request(url, headers={'User-Agent':'BARFEAND-site-maintenance/1.0'})
            with urlopen(req, timeout=35) as response:
                raw = response.read(15_000_000)
            image = Image.open(io.BytesIO(raw))
            image.load()
            image = ImageOps.exif_transpose(image)
            image.thumbnail((800,800) if group == 'productos' else (1400,1400), Image.Resampling.LANCZOS)
            image.save(target, 'WEBP', quality=85 if group == 'productos' else 92, method=6)
            print('IMPORTED', group, name, len(raw), target.stat().st_size, flush=True)
            return {'file':str(target.relative_to(ROOT)), 'source':url, 'bytes':target.stat().st_size}
        except Exception as exc:
            print('UNAVAILABLE', path, type(exc).__name__, flush=True)
    if required:
        raise RuntimeError('Required photo could not be imported: ' + name)
    return {'missingLabel':name, 'note':'Use the recipe transcription; never display another weight as this label.'}

def main():
    jobs = [('productos',name,[path],True) for name,path in PHOTOS.items()]
    jobs += [('etiquetas',name,paths,False) for name,paths in LABELS.items()]
    with ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(download,jobs))
    (ROOT/'data').mkdir(exist_ok=True)
    (ROOT/'data/assets-import.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    # Social card assembled only from existing product photos, without inventing a new pack.
    canvas = Image.new('RGB',(1200,630),'#faf8f5')
    for name,x in [('gall-indi-1000',50),('pollastre-1000',410),('conill-500',770)]:
        im=Image.open(ROOT/f'imagenes/productos/{name}.webp').convert('RGBA')
        im.thumbnail((380,510))
        canvas.paste(im,(x,(630-im.height)//2),im)
    canvas.save(ROOT/'imagenes/social.jpg',quality=87,optimize=True)
    print('ASSET_IMPORT_COMPLETE',len(results),flush=True)

if __name__ == '__main__': main()
