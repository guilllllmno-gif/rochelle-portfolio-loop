#!/usr/bin/env python3
"""Render the hero's seven original studio cutouts using only Pillow + stdlib.

Run: python3 generate_hero.py
Optional: --workers 4 --size 900
Geometry is ray-marched with rounded solid edges, inflated surfaces, welded seams
and a shared studio reflection environment. The iridescent coating is art-directed
to the supplied blue/violet/orange metal references; output is transparent cutouts.
"""
from __future__ import annotations

import argparse
import math
import multiprocessing as mp
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'assets' / 'hero'
PLUM = (43, 22, 48)
PI = math.pi
SQRT = math.sqrt
# Consistent silhouette framing makes CSS scale describe the object, not empty canvas.
SPECS = (
    ('chrome-orbit', (32, -19, -24), 1.08),
    ('iridescent-arc', (16, -18, -16), 1.16),
    ('chrome-bloom', (20, -15, -12), 1.10),
    ('iridescent-ribbon', (13, -24, -10), 1.15),
    ('iridescent-triangle', (14, -22, 12), 1.07),
    ('chrome-pebble', (32, -16, 26), .90),
    ('iridescent-cross', (20, -25, 9), 1.00),
)


def dot(a, b):
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]


def unit(v):
    s = 1 / max(1e-12, SQRT(dot(v, v)))
    return v[0]*s, v[1]*s, v[2]*s


def mix(a, b, t):
    return tuple(x*(1-t) + y*t for x, y in zip(a, b))


def smoothstep(a, b, x):
    t = max(0.0, min(1.0, (x-a)/(b-a)))
    return t*t*(3-2*t)


def rotation(angles):
    x, y, z = (v*PI/180 for v in angles)
    cx, sx, cy, sy, cz, sz = math.cos(x), math.sin(x), math.cos(y), math.sin(y), math.cos(z), math.sin(z)
    return ((cz*cy, cz*sy*sx-sz*cx, cz*sy*cx+sz*sx),
            (sz*cy, sz*sy*sx+cz*cx, sz*sy*cx-cz*sx),
            (-sy, cy*sx, cy*cx))


def transform(m, p):
    return dot(m[0], p), dot(m[1], p), dot(m[2], p)


def inverse(m, p):
    return (m[0][0]*p[0]+m[1][0]*p[1]+m[2][0]*p[2],
            m[0][1]*p[0]+m[1][1]*p[1]+m[2][1]*p[2],
            m[0][2]*p[0]+m[1][2]*p[1]+m[2][2]*p[2])


def bevelled_solid(distance, z, depth, bevel):
    a, b = distance+bevel, abs(z)-depth+bevel
    return SQRT(max(a, 0)**2+max(b, 0)**2)+min(max(a, b), 0)-bevel


def smooth_union(a, b, k):
    h = max(k-abs(a-b), 0)/k
    return min(a, b)-h*h*k*.25


def geometry(name):
    if name == 'chrome-orbit':
        def sdf(x, y, z):
            q = SQRT(x*x+y*y)-.68
            body = (SQRT(q*q+(z/.76)**2)-.27)*.76
            seam = SQRT((abs(q)-.266)**2+(z+.024)**2)-.014
            return min(body, seam)
    elif name == 'iridescent-arc':
        def sdf(x, y, z):
            yy = y+.48
            radial = abs(SQRT(x*x+yy*yy)-.66)
            profile = max(radial-.32, -yy)
            crown = .055*max(0, 1-(radial/.32)**2)
            return bevelled_solid(profile, z, .18+crown, .068)*.85
    elif name == 'chrome-bloom':
        def sdf(x, y, z):
            zz = (z/.76)**2
            body = profile = 10.0
            for ax, ay in ((1.0, 0.0), (.5, .8660254), (-.5, .8660254)):
                t = max(-.69, min(.69, x*ax+y*ay))
                planar = (x-t*ax)**2+(y-t*ay)**2
                body = smooth_union(body, SQRT(planar+zz)-.26, .28)
                profile = smooth_union(profile, SQRT(planar)-.26, .28)
            seam = SQRT(profile*profile+(z+.025)**2)-.015
            return min(body*.76, seam)
    elif name == 'chrome-pebble':
        def sdf(x, y, z):
            planar = max(abs(x)-.31,0)**2+y*y
            body = (SQRT(planar+(z/.68)**2)-.36)*.68
            seam = SQRT((SQRT(planar)-.36)**2+(z+.024)**2)-.014
            return min(body,seam)
    else:
        if name == 'iridescent-triangle':
            points = ((0,.73),(-.69,-.51),(.69,-.51),(0,.73))
            lines = tuple(zip(points,points[1:]))
            thickness = .15
        elif name == 'iridescent-cross':
            lines = (((-.61,0),(.61,0)),((0,-.61),(0,.61)))
            thickness = .22
        else:
            points = ((-.73,.56),(-.42,-.56),(.02,.51),(.47,-.53),(.76,.57))
            lines = tuple(zip(points,points[1:]))
            thickness = .19
        segments = tuple((ax,ay,bx-ax,by-ay,(bx-ax)**2+(by-ay)**2)
                         for (ax,ay),(bx,by) in lines)
        def sdf(x, y, z):
            profile = 10.0
            for ax,ay,dx,dy,length in segments:
                t = max(0, min(1, ((x-ax)*dx+(y-ay)*dy)/length))
                distance = SQRT((x-ax-t*dx)**2+(y-ay-t*dy)**2)-thickness
                profile = smooth_union(profile, distance, .13)
            return bevelled_solid(profile, z, .20, .083)*.90
    return sdf


def environment(v, roughness=0.0):
    """White studio panels and dark reflection cards, not a diffuse grey fill."""
    x, y, z = v
    ceiling = math.exp(-((y-.28)/(.63+roughness))**4-((x+.14)/1.25)**8)*1.30
    key = math.exp(-((x+.47)/(.22+roughness))**4-((y-.64)/.31)**4)*2.6
    strip = math.exp(-((x+.87)/(.057+roughness))**2-((y-.05)/.86)**8)*2.0
    rim = math.exp(-((x-.84)/(.065+roughness))**2-((y+.10)/.86)**6)*1.3
    card = 1-.88*math.exp(-((y+.30)/(.095+roughness))**2)
    light = (.07+ceiling+key+strip+rim)*card
    return light, light*.99, light*1.015




def shade(name, p, normal, matrix):
    foil = name in ('chrome-orbit','chrome-bloom','chrome-pebble')
    if foil:
        # Fine welded-edge crimping; the broad inflated faces remain smooth.
        seam = math.exp(-((p[2]+.024)/.052)**2)
        angle = math.atan2(p[1],p[0])
        ripple = seam*.075*math.sin(angle*142+.55*math.sin(angle*11))
        normal = unit((normal[0]+ripple*math.cos(angle),normal[1]+ripple*math.sin(angle),normal[2]))
    n = transform(matrix, normal)
    world = transform(matrix, p)
    reflected = unit((2*n[2]*n[0]+world[0]*.14,
                      2*n[2]*n[1]+world[1]*.14,2*n[2]*n[2]-1))
    env = environment(reflected, .022 if foil else .012)
    if foil:
        if name == 'chrome-orbit':
            occlusion = .77+.23*smoothstep(.44,.78,SQRT(p[0]*p[0]+p[1]*p[1]))
        else:
            occlusion = .85+.15*smoothstep(.18,.68,SQRT(p[0]*p[0]+p[1]*p[1]))
        return tuple((v*.96+.025)*occlusion for v in env),255
    rim = (1-max(0,n[2]))**1.6
    if name in ('iridescent-arc','iridescent-cross'):
        warm = math.exp(-((p[0]-.20)/1.10)**2-((p[1]+.25)/.68)**2)
        base = mix((.012,.15,1.05),(1.35,.27,.025),smoothstep(.10,.86,warm))
        base = mix(base,(.93,.012,.36),rim*.83)
    else:
        violet = smoothstep(-.85,.95,p[0]+p[1]*.65+n[0]*.22)
        base = mix((.009,.075,1.12),(.44,.032,.98),violet)
        cyan = math.exp(-((n[0]+.55)/.19)**2)*rim*.70
        base = mix(base,(.01,.66,1.08),cyan)
    illumination = sum(env)/3
    return tuple(base[i]*(.20+illumination*.90)+env[i]*.065 for i in range(3)),255


def render(spec, size):
    name, angles, extent = spec
    sdf = geometry(name)
    matrix = rotation(angles)
    direction = inverse(matrix, (0, 0, -1))
    image = Image.new('RGBA', (size, size))
    pixels = image.load()
    step = 2*extent/size
    # Analytic bounding sphere avoids marching empty transparent canvas.
    bound = {'chrome-orbit': 1.03, 'iridescent-arc': 1.20,
             'chrome-bloom': 1.08, 'iridescent-ribbon': 1.25,
             'iridescent-triangle': 1.10, 'chrome-pebble': .85,
             'iridescent-cross': 1.05}[name]
    epsilon = step*.20
    for iy in range(size):
        y = extent-(iy+.5)*step
        for ix in range(size):
            x = (ix+.5)*step-extent
            rr = x*x+y*y
            if rr >= bound*bound:
                continue
            near = SQRT(bound*bound-rr)
            origin = inverse(matrix, (x, y, near+.005))
            t = 0.0
            hit = False
            for _ in range(100):
                p = (origin[0]+direction[0]*t, origin[1]+direction[1]*t, origin[2]+direction[2]*t)
                distance = sdf(*p)
                if distance < epsilon:
                    hit = True
                    break
                t += max(distance*.88, epsilon*.3)
                if t > near*2+.025:
                    break
            if not hit:
                continue
            px, py, pz = p
            e = .0015
            normal = unit((sdf(px+e, py, pz)-sdf(px-e, py, pz),
                           sdf(px, py+e, pz)-sdf(px, py-e, pz),
                           sdf(px, py, pz+e)-sdf(px, py, pz-e)))
            color, alpha = shade(name, p, normal, matrix)
            # Gentle filmic shoulder keeps bright reflections controlled.
            rgb = tuple(round(255*(1-math.exp(-1.6*max(0, c)))**.72) for c in color)
            pixels[ix, iy] = (*rgb, alpha)
    return image


def make_asset(task):
    spec, size = task
    # Centre the actual silhouette, so all visible objects share the hero's line.
    rendered = render(spec, round(size*1.25))
    cutout = rendered.crop(rendered.getchannel('A').getbbox())
    cutout.thumbnail((round(size*.9),round(size*.9)),Image.Resampling.LANCZOS)
    image = Image.new('RGBA',(size,size))
    image.paste(cutout,((size-cutout.width)//2,(size-cutout.height)//2))
    path = OUT / f'{spec[0]}.webp'
    image.save(path, 'WEBP', quality=96, method=6, exact=True)
    print(f'Rendered {path.relative_to(ROOT)} ({size} × {size}, RGBA)', flush=True)
    return str(path)


def overview(paths):
    canvas = Image.new('RGB', (1800, 600*((len(paths)+2)//3)+20), PLUM)
    labels = ['INFLATED CHROME ORBIT', 'IRIDESCENT METAL ARC', 'SILVER FOIL BLOOM',
              'BLUE VIOLET METAL RIBBON', 'IRIDESCENT TRIANGLE', 'INFLATED CHROME PEBBLE',
              'IRIDESCENT CROSS', 'EXISTING VINYL']
    draw = ImageDraw.Draw(canvas)
    for index, path in enumerate(paths):
        image = Image.open(path).convert('RGBA')
        image.thumbnail((510, 510), Image.Resampling.LANCZOS)
        col, row = index % 3, index // 3
        row_offset=(3-min(3,len(paths)-row*3))*300
        x, y = row_offset+col*600+(600-image.width)//2, row*600+20
        shadow = Image.new('RGBA', canvas.size)
        mask = image.getchannel('A').filter(ImageFilter.GaussianBlur(13)).point(lambda a: int(a*.32))
        shadow.paste((9, 3, 13), (x+9, y+16), mask)
        canvas.paste(shadow, (0, 0), shadow)
        canvas.paste(image, (x, y), image)
        draw.text((row_offset+col*600+40, row*600+552), labels[index], fill=(219, 202, 225))
    path = ROOT / 'preview-hero-materials.jpg'
    canvas.save(path, quality=95, subsampling=0)
    print(f'Rendered {path.name}', flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workers', type=int, default=min(len(SPECS), mp.cpu_count()))
    parser.add_argument('--size', type=int, default=900)
    args = parser.parse_args()
    if args.size < 64 or args.workers < 1:
        parser.error('size must be at least 64 and workers at least 1')
    OUT.mkdir(parents=True, exist_ok=True)
    with mp.Pool(min(args.workers, len(SPECS))) as pool:
        paths = pool.map(make_asset, [(spec, args.size) for spec in SPECS])
    overview(paths + [str(ROOT / 'assets' / 'portfolio' / 'vinyl.webp')])


if __name__ == '__main__':
    main()
