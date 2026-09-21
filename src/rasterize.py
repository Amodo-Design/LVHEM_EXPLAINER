from pathlib import Path
import subprocess,concurrent.futures
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
def render(p):subprocess.run(['rsvg-convert','-w','4200' if p.stem.startswith('network') else '3600','-o',str(ROOT/'exports/png'/f'{p.stem}.png'),str(p)],check=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as e:list(e.map(render,(ROOT/'exports/svg').glob('*.svg')))
for name in ['network-overview','network-compute','network-intra','network-ethernet']:
 im=Image.open(ROOT/'exports/png'/f'{name}.png');im.thumbnail((1800,1700));bg=Image.new('RGBA',im.size,'#f6f4ed');bg.alpha_composite(im);bg.convert('RGB').save(ROOT/'exports'/f'preview-{name}.jpg',quality=95)
