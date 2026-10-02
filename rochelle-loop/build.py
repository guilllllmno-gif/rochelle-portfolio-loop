"""Build a fully self-contained portfolio HTML from the editable source folder."""
from pathlib import Path
import base64
import json
import mimetypes
import re

ROOT = Path(__file__).resolve().parent
TARGET = ROOT.parent / 'Rochelle-Portfolio.html'
styles = {name: (ROOT / name).read_text() for name in ('styles.css', 'projects.css', 'pages.css')}
font_paths = set(re.findall(r"url\(['\"]?(assets/fonts/[^'\")]+)['\"]?\)", '\n'.join(styles.values())))
assets = {}
for file in sorted((ROOT / 'assets').rglob('*')):
    if not file.is_file() or file.name.startswith('.'):
        continue
    relative = file.relative_to(ROOT).as_posix()
    if relative.startswith('assets/fonts/') and relative not in font_paths:
        continue  # Raster-art source fonts belong in the source package, not the browser payload.
    kind = mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
    assets[relative] = 'data:' + kind + ';base64,' + base64.b64encode(file.read_bytes()).decode('ascii')

html = (ROOT / 'index.html').read_text()
licenses = '\n\n'.join(file.name + '\n' + file.read_text() for file in sorted((ROOT / 'licenses').glob('*.txt')))
html = html.replace('</head>', '<script type="text/plain" id="third-party-licenses">' + licenses.replace('</script', '<\\/script') + '</script>\n</head>')
for name, css in styles.items():
    css = re.sub(r"url\(['\"]?(assets/[^'\")]+)['\"]?\)", lambda m: 'url("' + assets[m.group(1)] + '")', css)
    html = html.replace('<link rel="stylesheet" href="' + name + '">', '<style>\n' + css + '\n</style>')
manifest = '<script>window.ROCHELLE_ASSETS=' + json.dumps(assets, separators=(',', ':')) + ';</script>'
html = html.replace('<script src="core.js"></script>', manifest + '\n<script>\n' + (ROOT / 'core.js').read_text() + '\n</script>')
for name in ('projects.js', 'pages.js', 'vendor/gsap.min.js', 'vendor/MorphSVGPlugin.min.js', 'app.js'):
    script = (ROOT / name).read_text().replace('</script', '<\\/script')
    html = html.replace('<script src="' + name + '"></script>', '<script>\n' + script + '\n</script>')
TARGET.write_text(html)
print(f'{TARGET.name}: {TARGET.stat().st_size:,} bytes; {len(assets)} embedded assets; no external dependencies.')
