#!/usr/bin/env python3
"""Rebuild supplied-image studies, gallery visuals and original paper/print artwork.

Requires Python 3, Pillow, fonttools and uharfbuzz (python3 -m pip install Pillow fonttools uharfbuzz).
Usage: python3 generate_editorial.py '/path/to/untitled folder'
Optional --output, --sans-font and --serif-font override package-local paths.
Fonts are the bundled OFL Outfit and Fraunces source TTFs. No network required.
All interface data is illustrative; these are authored concept compositions.
"""
from argparse import ArgumentParser
from pathlib import Path
from html import escape
from io import BytesIO
from itertools import count
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 900, 1440
CREAM = '#f5f1e6'
PLUM = '#36253d'
LIFESTYLE = ['1', '10', '2', '3', '4', '5', '7', '8', '9']
PORTRAITS = {
    'cafe': '16_21_03 (3)',
    'studio': '16_00_17 (2)',
    'evening': '16_00_18 (6)',
}
GRADIENTS = [
    '18_09_20 (1)', '18_09_20 (2)', '18_09_21 (3)',
    '18_09_21 (4)', '18_09_21 (5)', '18_09_22 (6)',
    '18_09_22 (7)', '18_09_22 (8)', '18_09_23 (10)',
    '18_09_23 (9)', '18_09_24 (11)',
]
# Order follows projects.js: Future Pay (01–04), Bit2Go (05–08), G-DORISE (09–12).
COVERS = [
    ('Future Pay', 'Operations at a Glance'),
    ('Future Pay', 'States That Guide'),
    ('Future Pay', 'Issuing, Explained'),
    ('Future Pay', 'Exception Handling'),
    ('Bit2Go', 'A Recognizable Gateway'),
    ('Bit2Go', 'Across Every Screen'),
    ('Bit2Go', 'Payments, Step by Step'),
    ('Bit2Go', 'From Site to Dashboard'),
    ('G-DORISE', 'A Character with Rules'),
    ('G-DORISE', 'An Expressive Toolkit'),
    ('G-DORISE', 'A Style That Stays Hers'),
    ('G-DORISE', 'Beyond the Character Sheet'),
]
COVER_STUDIES = [
    (('Clear', 'view.'), 'PAPER / TEXTILE / PERSPECTIVE'),
    (('In good', 'order.'), 'DIRECTION / COLOUR / RHYTHM'),
    (('Future', 'ready.'), 'FOLDS / LETTERFORMS / POSSIBILITY'),
    (('A way', 'forward.'), 'LAYERS / CONTRAST / MOVEMENT'),
    (('A clearer', 'way in.'), 'AN OPEN SHAPE / A NEW BEGINNING'),
    (('One idea.', 'Every screen.'), 'ONE FORM / MANY PERSPECTIVES'),
    (('Find your', 'flow.'), 'A CONTINUOUS LINE / A CLEARER PATH'),
    (('Quietly', 'capable.'), 'STRUCTURE / BALANCE / SIMPLICITY'),
    (('Hello,', 'possibility.'), 'A LITTLE CHARACTER / ROOM TO PLAY'),
    (('More than', 'a mood.'), 'FOLDS / COLOUR / EXPRESSION'),
    (('A style of', 'her own.'), 'A PERSONAL THREAD / A SHARED LANGUAGE'),
    (('Little', 'worlds.'), 'SMALL DETAILS / NEW DISCOVERIES'),
]

# Homepage-only art; the shared Work and case-study covers remain unchanged.
GALLERY_STUDIES = [
    ('OPERATIONS', '#e0d7ed'),
    ('STATUS SYSTEMS', '#f1ebdf'),
    ('ISSUING', '#cab8dc'),
    ('CASE REVIEW', '#f1c7b5'),
    ('PAYMENTS', '#2b1630'),
    ('WEB & MOBILE', '#dfd8e9'),
    ('PAYMENT FLOWS', '#f5b994'),
    ('WORKSPACE', '#32203b'),
]


def source_image(folder, fragment):
    matches = sorted(folder.glob('*' + fragment + '.png'))
    if len(matches) != 1:
        raise ValueError(f'Expected one source for {fragment!r}, found {len(matches)}')
    return Image.open(matches[0]).convert('RGB')


def save_webp(image, destination, quality=86, lossless=False):
    image.save(destination, 'WEBP', quality=quality, method=6, lossless=lossless)
    print(f'{destination.name}: {image.width}x{image.height}; {destination.stat().st_size:,} bytes')




class SvgLayer:
    """Small vector scene: geometry stays unfiltered; only silhouettes cast shadows."""

    def __init__(self, width, height, identifiers, radius=0):
        self.width, self.height = width, height
        self.identifier = f'layer-{next(identifiers)}'
        self.radius = radius
        self.elements = []

    def rect(self, box, fill='none', radius=0, stroke='none', width=1):
        x, y, right, bottom = box
        self.elements.append(f'<rect x="{x}" y="{y}" width="{right-x}" height="{bottom-y}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')

    def ellipse(self, box, fill='none', stroke='none', width=1):
        x, y, right, bottom = box
        self.elements.append(f'<ellipse cx="{(x+right)/2}" cy="{(y+bottom)/2}" rx="{(right-x)/2}" ry="{(bottom-y)/2}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')

    def line(self, points, color, width=1):
        coordinates = ' '.join(f'{x},{y}' for x, y in points)
        self.elements.append(f'<polyline points="{coordinates}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')

    def path(self, data, fill='none', stroke='none', width=1):
        self.elements.append(f'<path d="{data}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')

    def place(self, item, center, angle=0, shadow=True):
        transform = f'translate({center[0]} {center[1]}) rotate({-angle}) translate({-item.width/2} {-item.height/2})'
        silhouette = f'<g filter="url(#shadow)">{item.elements[0]}</g>' if shadow else ''
        content = ''.join(item.elements)
        if item.radius:
            clip = f'<clipPath id="{item.identifier}-clip"><rect width="{item.width}" height="{item.height}" rx="{item.radius}"/></clipPath>'
            content = f'<defs>{clip}</defs><g clip-path="url(#{item.identifier}-clip)">{content}</g>'
        self.elements.append(f'<g transform="{transform}">{silhouette}<svg width="{item.width}" height="{item.height}" viewBox="0 0 {item.width} {item.height}" overflow="hidden">{content}</svg></g>')


class Studio:
    def __init__(self, output, sans, serif):
        self.output = output
        self.sans = sans
        self.serif = serif
        self.fonts = {}
        self.vector_face = None
        self.vector_styles = {}
        self.vector_paths = {}

    def font(self, size, italic=False, weight=450):
        key = size, italic, weight
        if key not in self.fonts:
            f = ImageFont.truetype(str(self.serif if italic else self.sans), size)
            try:
                axes = f.get_variation_axes()
                values = [weight if a['name'] == b'Weight' else a['default'] for a in axes]
                f.set_variation_by_axes(values)
            except (OSError, AttributeError):
                pass
            self.fonts[key] = f
        return self.fonts[key]

    def text(self, image, xy, words, size=24, fill=PLUM, italic=False, weight=450, anchor=None):
        ImageDraw.Draw(image).text(xy, words, font=self.font(size, italic, weight), fill=fill, anchor=anchor, spacing=0)

    def lines(self, image, xy, words, size=104, fill=PLUM, italic_last=True, leading=.95):
        for n, word in enumerate(words):
            self.text(image, (xy[0], xy[1] + round(n * size * leading)), word, size, fill, italic_last and n == len(words) - 1)


    def frame(self, image, n, brand):
        ink = PLUM
        draw = ImageDraw.Draw(image)
        draw.rectangle((28, 28, W - 29, H - 29), outline=ink, width=1)
        self.text(image, (62, 67), brand.upper(), 23, ink, weight=550)
        self.text(image, (839, 69), f'R / {n:02}', 19, ink, anchor='ra')
        draw.line((62, 123, 838, 123), fill=ink, width=1)
        draw.line((62, 1327, 838, 1327), fill=ink, width=1)
        self.text(image, (62, 1351), 'CONCEPT STUDY', 18, ink, weight=500)
        self.text(image, (839, 1351), 'ROCHELLE  /  2026' if brand != 'Bit2Go' else 'ROCHELLE  /  2025', 17, ink, anchor='ra')


    def place(self, canvas, item, center, angle=0, shadow=True):
        if angle:
            item = item.rotate(angle, Image.Resampling.BICUBIC, expand=True)
        x, y = round(center[0]-item.width/2), round(center[1]-item.height/2)
        if shadow:
            layer = Image.new('RGBA', canvas.size)
            shade = Image.new('RGBA', item.size, '#30203d')
            shade.putalpha(item.getchannel('A').point(lambda a: round(a*.18)))
            layer.alpha_composite(shade, (x, y + 24))
            canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(20)))
        canvas.alpha_composite(item, (x, y))


    def relief(self, mask, color, depth=16, softness=9, finish='matte', scale=1):
        """Bake tactile relief for the mixed-media covers and footer artwork."""
        rgb=Image.new('RGB',(1,1),color).getpixel((0,0))
        width,height=mask.size
        depth=round(depth*scale)
        softness*=scale
        surface=Image.new('RGBA',mask.size)
        pixels=surface.load()
        alpha=mask.load()
        height_map=mask.filter(ImageFilter.GaussianBlur(softness)).point(lambda v:max(0,2*v-255))
        heights=height_map.load()
        left,top,right,bottom=mask.getbbox()
        rng=random.Random(702)
        for y in range(top,bottom):
            for x in range(left,right):
                if not alpha[x,y]:
                    continue
                nx=(heights[max(0,x-1),y]-heights[min(width-1,x+1),y])*depth/255
                ny=(heights[x,max(0,y-1)]-heights[x,min(height-1,y+1)])*depth/255
                length=math.sqrt(nx*nx+ny*ny+1)
                nx,ny,nz=nx/length,ny/length,1/length
                diffuse=max(0,-.48*nx-.6*ny+.64*nz)
                shine=max(0,-.27*nx-.34*ny+.9*nz)
                lighting=.48+.66*diffuse
                grain=rng.randrange(-3,4)
                specular=0
                if finish=='cloth':
                    lighting+=.07*math.cos(x*math.tau/6)+.065*math.cos(y*math.tau/6)
                    grain+=3 if (x//3+y//3)%2 else -3
                elif finish=='metal':
                    specular=195*shine**28
                    lighting+=.2*math.sin(x*.023+y*.017)
                elif finish=='resin':
                    specular=170*shine**45
                    lighting+=.08*math.sin(x*.012+y*.009)
                elif finish in ('ceramic','acetate'):
                    specular=115*shine**24
                    lighting+=.055*math.sin((x+y)*.013)
                elif finish=='ribbed':
                    # Ease shallow flutes into the bevel instead of striping the rim.
                    phase=(x+y*.21)*math.tau/(14*scale)
                    taper=min(1,heights[x,y]/220)
                    lighting+=taper*(.09*math.cos(phase)+.012*math.sin(phase*2))
                elif finish=='mesh':
                    hole=math.hypot(x%17-8,y%17-8)
                    lighting+=-.43 if hole<3.8 else (.13 if hole<5.4 and y%17>8 else 0)
                elif finish=='felt':
                    grain+=rng.randrange(-6,7)
                    lighting+=.015*math.cos((x-y)*.4)
                elif finish=='paper':
                    grain+=5 if (x*17+y*31)%97<4 else 0
                pixels[x,y]=tuple(max(0,min(255,round(c*lighting+specular+grain))) for c in rgb)+(alpha[x,y],)
        item=Image.new('RGBA',mask.size)
        side=Image.new('RGBA',mask.size,tuple(round(c*.55) for c in rgb))
        side.putalpha(mask)
        for offset in range(depth,0,-1):
            item.alpha_composite(side,(round(offset*.42),offset))
        item.alpha_composite(surface)
        return item
    def mount_material(self, canvas, item, center, angle=0, thickness=5, edge='#b6ab94', lift=15, shadow_strength=1):
        item = item.rotate(angle, Image.Resampling.BICUBIC, expand=True)
        x, y = round(center[0]-item.width/2), round(center[1]-item.height/2)
        alpha = item.getchannel('A')
        for opacity, blur, dx, dy in [(.26, lift*.75, lift*.55, lift+thickness), (.23, 3, 2, thickness+3)]:
            shadow = Image.new('RGBA', item.size, '#251d28')
            shadow.putalpha(alpha.point(lambda a: round(a*opacity*shadow_strength)))
            layer = Image.new('RGBA', canvas.size)
            layer.alpha_composite(shadow, (x+round(dx), y+round(dy)))
            canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))
        side = Image.new('RGBA', item.size, edge)
        side.putalpha(alpha)
        for depth in range(thickness, 0, -1):
            canvas.alpha_composite(side, (x+round(depth*.42), y+depth))
        canvas.alpha_composite(item, (x, y))

    def material_paper(self, width, height, color, rng):
        base = Image.new('RGB', (width, height), color)
        grain = Image.frombytes('L', base.size, bytes(rng.randrange(65, 196) for _ in range(width * height)))
        sheet = Image.blend(base, grain.convert('RGB'), .085).convert('RGBA')
        fibers = Image.new('RGBA', base.size)
        fd = ImageDraw.Draw(fibers)
        for _ in range(width*height//95):
            x, y = rng.randrange(width), rng.randrange(height)
            fd.line((x, y, x+rng.randrange(2, 8), y+rng.randrange(-2, 3)), fill=(255, 249, 224, rng.randrange(18, 65)), width=1)
        sheet.alpha_composite(fibers)
        lighting = Image.new('RGBA', base.size)
        ld = ImageDraw.Draw(lighting)
        for y in range(height):
            shade = round(13+11*math.sin(y/height*math.tau-.8))
            ld.line((0, y, width, y), fill=(52, 37, 26, shade))
        sheet.alpha_composite(lighting)
        mask = Image.new('L', base.size)
        points = [(x, rng.randrange(2, 8)) for x in range(0, width, 9)]
        points += [(width-1-rng.randrange(2, 7), y) for y in range(0, height, 9)]
        points += [(x, height-1-rng.randrange(2, 8)) for x in range(width-1, -1, -9)]
        points += [(rng.randrange(2, 7), y) for y in range(height-1, -1, -9)]
        ImageDraw.Draw(mask).polygon(points, fill=255)
        ImageDraw.Draw(sheet).line(points[:width//9], fill='#fbf1d3', width=2)
        sheet.putalpha(mask)
        return sheet

    def material_cloth(self, width, height, color, rng):
        backing = self.material_paper(width, height, color, rng)
        threads = Image.new('RGBA', backing.size)
        td = ImageDraw.Draw(threads)
        for x in range(10, width-7, 6):
            td.line((x, 9, x, height-11), fill=(43, 24, 49, 74), width=2)
            td.line((x+2, 9, x+2, height-11), fill=(255, 244, 220, 94), width=1)
        for row, y in enumerate(range(10, height-11, 6)):
            td.line((8, y, width-10, y), fill=(255, 242, 225, 55), width=2)
            for x in range(10+(row%2)*6, width-12, 12):
                td.line((x, y, x+4, y), fill=(255, 247, 232, 120), width=2)
        td.rectangle((17, 18, width-17, height-19), outline=(255, 249, 236, 100), width=2)
        backing.alpha_composite(threads)
        return backing

    def collage(self):
        """Contact-callout collage, kept independent from the project collection."""
        rng = random.Random(420)
        ink, ivory, coral, lilac, yellow = '#2b1630', '#f2ecd9', '#e96641', '#b9a6d0', '#e7e572'
        canvas = Image.new('RGBA', (900, 900))


        # Woven cloth over a substantial board, with alternating warp/weft yarn.
        backing = self.material_cloth(490, 600, lilac, rng)
        self.mount_material(canvas, backing, (420, 449), 15, 13, '#786580', 22)
        sheet = self.material_paper(480, 579, ivory, rng)
        self.text(sheet, (29, 28), 'AN OPEN-ENDED EXPLORATION', 15, ink)
        ImageDraw.Draw(sheet).line((30, 57, 448, 57), fill=ink, width=1)
        self.text(sheet, (30, 509), 'COLLECT / CONNECT / CREATE', 16, ink)
        self.text(sheet, (30, 538), 'ROCHELLE   —   STUDY 01', 14, ink)
        # A folded lower corner exposes the underside and casts a short crease.
        corner = Image.new('RGBA', sheet.size)
        cd = ImageDraw.Draw(corner)
        cd.polygon([(397, 576), (477, 496), (477, 576)], fill='#b8ae94')
        cd.polygon([(397, 576), (474, 496), (405, 498)], fill='#fbf4de')
        cd.line((405, 498, 474, 496), fill='#fffbea', width=2)
        cd.line((397, 576, 405, 498), fill='#d1c6ab', width=3)
        sheet.alpha_composite(corner)
        self.mount_material(canvas, sheet, (440, 455), -8, 4, '#c8bca0', 19)

        # Corrugated relief: rounded ribs catch the light, not printed stripes.
        disc = Image.new('RGBA', (292, 292))
        rgb = Image.new('RGB', (1, 1), yellow).getpixel((0, 0))
        pixels = disc.load()
        for y in range(292):
            for x in range(292):
                nx, ny = (x-146)/141, (y-146)/141
                radius = math.hypot(nx, ny)
                if radius <= 1:
                    bevel = max(0, (radius-.89)/.11)
                    ribs = .17*math.cos(x*math.tau/15)+.035*math.sin(x*math.tau/5)
                    light = 1.02-.11*(nx+ny)-.27*bevel**2+ribs
                    pixels[x,y] = tuple(max(0, min(255, round(c*light+rng.randrange(-3, 4)))) for c in rgb)+(255,)
        dd = ImageDraw.Draw(disc)
        dd.arc((6, 6, 286, 286), 188, 286, fill='#fff6c6', width=3)
        self.mount_material(canvas, disc, (681, 220), -30, 16, '#8e8a41', 27)
        # A soft, perforated rubber disc: recessed holes with lit lower rims.
        circle = Image.new('RGBA', (290, 290))
        rgb = Image.new('RGB', (1, 1), coral).getpixel((0, 0))
        pixels = circle.load()
        for y in range(290):
            for x in range(290):
                nx, ny = (x-145)/139, (y-145)/139
                radius = math.hypot(nx, ny)
                if radius <= 1:
                    light = 1.04-.12*(nx+ny)-.2*max(0, (radius-.83)/.17)**2
                    grain = rng.randrange(-5, 6)
                    pixels[x,y] = tuple(max(0, min(255, round(c*light+grain))) for c in rgb)+(255,)
        cd = ImageDraw.Draw(circle)
        for row, y in enumerate(range(27, 268, 15)):
            for x in range(27+(row%2)*7, 268, 15):
                if (x-145)**2+(y-145)**2 < 117**2:
                    cd.ellipse((x-3, y-2, x+5, y+7), fill='#f9bb88')
                    cd.ellipse((x-3, y-3, x+4, y+4), fill='#933e30')
                    cd.ellipse((x-2, y-3, x+2, y+1), fill='#683c34')
        cd.arc((7, 7, 283, 283), 187, 286, fill='#ffd2a0', width=3)
        self.mount_material(canvas, circle, (188, 596), 0, 19, '#a1422e', 25)

        words = ('New', 'ideas.')
        # Thick torn word cards, with restrained letterpress edge highlights.
        for i, word in enumerate(words):
            size = 115 if len(word) < 7 else 100
            font = self.font(size, italic=i == 1, weight=450)
            bounds = font.getbbox(word)
            strip = self.material_paper(round(font.getlength(word))+48, 151, yellow if i == 0 else ink, rng)
            sd = ImageDraw.Draw(strip)
            xy = (24, 20-bounds[1])
            sd.text((xy[0]+2, xy[1]+3), word, font=font, fill='#958e44' if i == 0 else '#120d16')
            sd.text((xy[0]-1, xy[1]-2), word, font=font, fill='#faf4b0' if i == 0 else '#fffbee')
            sd.text(xy, word, font=font, fill=ink if i == 0 else ivory)
            self.mount_material(canvas, strip, (424+i*52, 352+i*158), [6, -5][i], 7, '#aaa448' if i == 0 else '#160e20', 15)

        # The old ink doodle becomes a thin sculptural cord with a lit ridge.
        points = [(646+94*math.sin(t), 544+160*math.sin(2*t+.4)) for t in (i*math.tau/560 for i in range(561))]
        shadow = Image.new('RGBA', canvas.size)
        ImageDraw.Draw(shadow).line([(x+6,y+9) for x,y in points], fill='#271d2970', width=12, joint='curve')
        canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(4)))
        annotation = Image.new('RGBA', canvas.size)
        ad = ImageDraw.Draw(annotation)
        ad.line(points, fill='#281c30', width=10, joint='curve')
        ad.line([(x-2,y-2) for x,y in points], fill='#88718c', width=3, joint='curve')
        ad.line([(x-2,y-3) for x,y in points], fill='#d3bfc7', width=1, joint='curve')
        canvas.alpha_composite(annotation)
        label = self.material_paper(580, 86, coral, rng)
        self.text(label, (28, 29), 'START WITH A CONVERSATION', 23, ink, weight=500)
        self.mount_material(canvas, label, (473, 723), -6, 5, '#a64c37', 12)
        # Frosted tape with tiny creases and translucent reflected highlights.
        tape = Image.new('RGBA', (146, 50), '#e9dcbdb5')
        sheen = Image.new('RGBA', tape.size)
        td = ImageDraw.Draw(sheen)
        for x in range(3, 143):
            alpha = round(30+28*math.sin(x*.15))
            td.line((x, 2, x+2, 46), fill=(255, 252, 228, alpha), width=1)
        td.line((3, 2, 142, 2), fill='#fffcebdd', width=2)
        td.line((4, 46, 140, 46), fill='#a69b7470', width=2)
        tape.alpha_composite(sheen)
        self.place(canvas, tape, (303, 164), 17, shadow=False)
        return canvas


    def cover_collage(self, n):
        """Render native 2× material detail without changing the composition grid."""
        rng = random.Random(1200+n)
        scale = 2
        canvas = Image.new('RGBA',(900*scale,900*scale))
        ink, ivory, coral, lilac, lime = '#2b1630','#f2ecd9','#e96641','#b9a6d0','#e7e572'

        def units(values):
            return tuple(round(value*scale) for value in values)

        def mount(item,center,angle=0,thickness=4,edge='#b6ab94',lift=12):
            self.mount_material(canvas,item,units(center),angle,round(thickness*.55*scale),
                                edge,lift*.75*scale,shadow_strength=.72)

        def cloth(width,height,center,angle=0):
            mount(self.material_cloth(width*scale,height*scale,lilac,rng),center,angle,10,'#82718e',16)

        def sheet(width,height,center,angle=0):
            item=self.material_paper(width*scale,height*scale,ivory,rng)
            self.text(item,units((28,27)),'FORM / MATERIAL / POSSIBILITY',15*scale,ink,weight=500)
            d=ImageDraw.Draw(item)
            d.line(units((28,54,width-28,54)),fill=ink,width=scale)
            self.text(item,units((28,height-47)),f'ROCHELLE  /  MATERIAL STUDY {n:02}',14*scale,ink)
            d.polygon([units(p) for p in [(width-72,height-8),(width-8,height-76),(width-8,height-8)]],fill='#b9ad94')
            d.polygon([units(p) for p in [(width-72,height-8),(width-12,height-76),(width-65,height-69)]],fill='#fff8e5')
            mount(item,center,angle,3,'#c8bca0',10)

        def shape(mask,color,center,angle=0,finish='ribbed',depth=15):
            item=self.relief(mask,color,max(2,round(depth*.45)),3 if finish=='paper' else 4,
                             'matte' if finish=='perforated' else finish,scale=scale)
            if finish=='perforated':
                width,height=mask.width//scale,mask.height//scale
                safe=mask.resize((width,height),Image.Resampling.NEAREST).filter(ImageFilter.MinFilter(19)).load()
                rgb=Image.new('RGB',(1,1),color).getpixel((0,0))
                shade=tuple(round(c*.56) for c in rgb)
                light=tuple(round(c*.75+255*.25) for c in rgb)
                d=ImageDraw.Draw(item)
                for row,y in enumerate(range(18,height-18,17)):
                    for x in range(18+row%2*8,width-18,17):
                        if safe[x,y]==255:
                            d.ellipse(units((x-3.5,y-3,x+4.5,y+5)),fill=light)
                            d.ellipse(units((x-3.5,y-3.5,x+3.5,y+3)),fill=shade)
                            d.ellipse(units((x-2.5,y-3.5,x+2,y)),fill=tuple(round(c*.8) for c in shade))
            mount(item,center,angle,0,lift=14 if depth>8 else 8)

        def polygon(points,size,color,center,angle=0,finish='paper',depth=8):
            mask=Image.new('L',units(size))
            ImageDraw.Draw(mask).polygon([units(p) for p in points],fill=255)
            shape(mask,color,center,angle,finish,depth)

        def disc(diameter,color,center,angle=0,finish='ribbed'):
            mask=Image.new('L',units((diameter+40,diameter+40)))
            ImageDraw.Draw(mask).ellipse(units((16,16,diameter+15,diameter+15)),fill=255)
            shape(mask,color,center,angle,finish,17)

        def bar(width,height,color,center,angle=0,finish='felt'):
            mask=Image.new('L',units((width+40,height+40)))
            ImageDraw.Draw(mask).rounded_rectangle(units((16,16,width+15,height+15)),radius=18*scale,fill=255)
            shape(mask,color,center,angle,finish,13)

        def label(words,color,center,angle=0,size=54,italic=True):
            font=self.font(size*scale,italic=italic,weight=450 if italic else 550)
            width=round(font.getlength(words))+54*scale
            item=self.material_paper(width,(size+66)*scale,color,rng)
            bounds=font.getbbox(words)
            foreground=ivory if color==ink else ink
            d=ImageDraw.Draw(item)
            d.text((27*scale,24*scale-bounds[1]),words,font=font,fill=foreground)
            mount(item,center,angle,5,'#160e20' if color==ink else '#b1a784',12)

        def cord(center,rx=70,ry=170,angle=0,phase=.4):
            item=Image.new('RGBA',units((rx*2+40,ry*2+40)))
            points=[(scale*(rx+20+rx*math.sin(t)),scale*(ry+20+ry*math.sin(2*t+phase)))
                    for t in (i*math.tau/1120 for i in range(1121))]
            d=ImageDraw.Draw(item)
            d.line(points,fill=ink,width=6*scale,joint='curve')
            d.line([(x-scale,y-scale) for x,y in points],fill='#85708a',width=2*scale,joint='curve')
            d.line([(x-scale,y-2*scale) for x,y in points],fill='#c7b6cd',width=scale,joint='curve')
            mount(item,center,angle,1,ink,7)

        def tape(center,angle=0):
            item=Image.new('RGBA',units((126,43)),'#eee5b69f')
            d=ImageDraw.Draw(item)
            d.line(units((2,2,123,2)),fill='#fffbe5b0',width=scale)
            d.line(units((3,40,122,40)),fill='#bcaf8950',width=scale)
            self.place(canvas,item,units(center),angle,shadow=False)

        if n==1:
            cloth(435,536,(425,441),8)
            sheet(402,491,(439,429),-9)
            mask=Image.new('L',units((414,459)))
            d=ImageDraw.Draw(mask)
            d.rounded_rectangle(units((20,20,384,424)),58*scale,fill=255)
            d.rounded_rectangle(units((107,112,297,332)),25*scale,fill=0)
            shape(mask,lime,(420,419),-12,'ribbed',18)
            disc(239,coral,(667,607),7,'perforated')
            cord((236,563),51,127,-17)
            label('a clearer view',ink,(456,714),-6,58)
            tape((394,161),7)
        elif n==2:
            cloth(340,579,(434,460),-6)
            sheet(346,542,(435,440),6)
            for color,center,angle,finish in [
                    (coral,(348,299),-10,'perforated'),
                    (lime,(510,472),8,'ribbed'),
                    (ivory,(357,630),-9,'felt')]:
                polygon([(20,22),(131,22),(302,148),(130,274),(20,274),(180,148)],
                        (340,314),color,center,angle,finish,17)
            cord((635,368),41,134,17)
            label('in its place',ink,(570,749),5,52)
            tape((430,179),-7)
        elif n==3:
            cloth(460,498,(431,447),8)
            sheet(399,438,(477,354),-12)
            label('F',lime,(444,363),-9,173)
            polygon([(20,100),(280,18),(533,110),(507,370),(47,366)],
                    (565,410),lilac,(447,570),5,'cloth',8)
            polygon([(34,75),(281,271),(525,81),(499,366),(50,357)],
                    (565,410),ivory,(447,591),5,'paper',5)
            disc(164,coral,(254,664),-16,'perforated')
            cord((679,401),47,138,15)
            label('tomorrow, today',ink,(507,754),-5,49)
        elif n==4:
            cloth(455,532,(440,463),-7)
            sheet(403,498,(410,441),8)
            bar(135,450,coral,(650,453),-14,'perforated')
            polygon([(178,20),(32,294),(170,278),(100,535),(414,189),(260,209),(342,25)],
                    (455,575),lime,(407,431),-10,'ribbed',19)
            cord((293,670),105,52,15)
            label('a different way',ink,(476,735),-7,49)
            tape((459,176),8)
        elif n==5:
            cloth(446,536,(438,469),7)
            sheet(428,539,(450,440),-5)
            mask=Image.new('L',units((486,545)))
            d=ImageDraw.Draw(mask)
            d.rounded_rectangle(units((24,22,450,509)),205*scale,fill=255)
            d.rectangle(units((24,259,450,509)),fill=255)
            d.rounded_rectangle(units((140,147,337,550)),100*scale,fill=0)
            d.rectangle(units((140,281,337,550)),fill=0)
            shape(mask,lime,(437,440),-7,'ribbed',20)
            disc(205,coral,(663,260),-13,'perforated')
            cord((460,526),54,150,-16)
            label('an open invitation',ink,(461,748),-6,43)
        elif n==6:
            cloth(589,397,(440,505),-13)
            sheet(395,468,(445,403),9)
            disc(194,coral,(685,316),-14,'perforated')
            for i in range(6):
                x0,y0=93+i*94,125+abs(2.5-i)*29
                polygon([(x0,y0),(x0+91,y0+20),(441,614)],(745,664),
                        ivory if i%2==0 else '#c9bba0',(432,449),-4,'paper',7)
            polygon([(25,23),(222,219),(71,499)],(257,538),lime,(657,538),-12,'ribbed',16)
            cord((240,605),53,102,13)
            label('same idea, new angle',ink,(463,748),-4,43)
            tape((470,171),9)
        elif n==7:
            cloth(426,577,(425,460),-7)
            sheet(408,537,(433,449),7)
            disc(197,lime,(659,260),-24)
            mask=Image.new('L',units((460,579)))
            d=ImageDraw.Draw(mask)
            for i in range(1001):
                t=-.75*math.pi+i*1.5*math.pi/1000
                x,y=230+137*math.sin(t),69+421*i/1000
                d.ellipse(units((x-47,y-47,x+47,y+47)),fill=255)
            shape(mask,coral,(447,459),7,'perforated',18)
            bar(122,111,lilac,(287,276),-12,'cloth')
            cord((642,623),43,112,-12)
            label('keep moving',ink,(412,756),4,59)
        elif n==8:
            cloth(502,488,(441,470),7)
            sheet(470,489,(445,419),-7)
            for color,center,height,finish in [
                    (coral,(285,548),225,'perforated'),
                    (ivory,(444,479),348,'felt'),
                    (lime,(606,408),476,'ribbed')]:
                bar(117,height,color,center,-7,finish)
            cord((668,665),70,65,-16)
            label('less noise',ink,(425,751),-4,68)
            tape((455,164),-7)
        elif n==9:
            cloth(458,565,(450,470),3)
            sheet(438,535,(468,440),-12)
            disc(237,coral,(251,593),6,'perforated')
            mask=Image.new('L',units((475,475)))
            d=ImageDraw.Draw(mask)
            for i in range(6):
                t=i*math.tau/6
                end=(231+156*math.cos(t),231+156*math.sin(t))
                d.line(units((231,231,*end)),fill=255,width=78*scale)
                d.ellipse(units((end[0]-39,end[1]-39,end[0]+39,end[1]+39)),fill=255)
            shape(mask,lime,(484,342),-18,'ribbed',19)
            label('curious',ink,(492,596),-10,84)
            cord((696,617),59,151,-16)
            label('room to play',coral,(462,762),-8,50)
            tape((468,153),2)
        elif n==10:
            cloth(412,585,(443,470),-7)
            sheet(390,517,(480,435),6)
            disc(217,lime,(262,286),-25,'perforated')
            for i in range(5):
                y=116+i*91
                polygon([(63,y),(367,y+23),(400,y+102),(94,y+79)],(457,665),
                        coral if i%2==0 else '#be5139',(463,463),8,'paper',11)
            cord((662,583),67,145,-12)
            label('change the energy',ink,(466,764),-5,45)
            tape((516,155),7)
        elif n==11:
            cloth(454,555,(432,461),7)
            sheet(408,529,(450,440),-6)
            polygon([(20,121),(176,23),(292,219),(414,27),(567,116),(292,363)],
                    (610,409),coral,(445,344),-5,'felt',15)
            polygon([(29,26),(176,49),(284,438),(129,414)],
                    (327,486),lilac,(326,568),-13,'cloth',11)
            polygon([(35,50),(195,24),(294,440),(151,465)],
                    (337,506),coral,(584,553),11,'ribbed',13)
            mask=Image.new('L',units((200,192)))
            d=ImageDraw.Draw(mask)
            d.rounded_rectangle(units((21,19,167,156)),31*scale,fill=255)
            d.rounded_rectangle(units((69,61,122,110)),9*scale,fill=0)
            shape(mask,lime,(448,409),-7,'perforated',16)
            cord((679,389),39,125,8)
            label('a personal thread',ink,(457,754),-5,46)
        elif n==12:
            cloth(469,534,(434,475),6)
            sheet(429,498,(438,445),-7)
            disc(244,lime,(622,279),-27)
            for i,color in enumerate((lilac,ivory,coral)):
                shift=i*53
                points=[(25,419),(79,240+shift),(206,179+shift),(285,60+shift),
                        (399,106+shift),(523,276+shift),(511,483),(31,495)]
                polygon(points,(562,540),color,(429,492+i*44),-6,
                        'cloth' if i==0 else 'paper',10)
            disc(101,coral,(225,350),7,'perforated')
            cord((670,596),48,117,-19)
            label('little discoveries',ink,(450,762),-5,49)
            tape((407,173),-7)
        return canvas

    def cover(self, n, artwork_output=None):
        brand, _ = COVERS[n-1]
        headings, materials = COVER_STUDIES[n-1]
        image = Image.new('RGBA', (W, H), CREAM)
        self.frame(image, n, brand)
        scale = 105
        while max(self.font(scale, italic=i==1).getlength(word) for i,word in enumerate(headings)) > 774:
            scale -= 1
        self.lines(image, (63, 178), headings, scale)
        self.text(image, (67, 427), materials, 17, '#78677a', weight=500)
        artwork = self.cover_collage(n)
        if artwork_output is not None:
            artwork_output.mkdir(parents=True,exist_ok=True)
            artwork.save(artwork_output/f'collage-{n:02}.png',optimize=True)
        art = artwork.resize((840, 840), Image.Resampling.LANCZOS)
        self.place(image, art, (450, 875), shadow=False)
        save_webp(image.convert('RGB'), self.output/f'cover-{n:02}.webp', 93)

    def gallery_cover(self, n):
        """Render eight text-light SVG covers; all lettering is shaped and outlined."""
        import uharfbuzz as hb
        from fontTools.ttLib import TTFont
        from fontTools.pens.svgPathPen import SVGPathPen

        if self.vector_face is None:
            data = self.sans.read_bytes()
            self.vector_face = TTFont(BytesIO(data)), hb.Face(data)
        font, face = self.vector_face
        glyph_definitions = {}
        discipline, background = GALLERY_STUDIES[n-1]
        brand, _ = COVERS[n-1]
        ink, cream, coral, lilac, mint = '#2b1630', '#faf6ec', '#f47a50', '#c5b8e9', '#d9e5b5'
        foreground = cream if n in (5, 8) else ink
        identifiers = count()
        image = SvgLayer(W, H, identifiers)
        image.rect((0, 0, W, H), background)
        scene = SvgLayer(900, 1070, identifiers)

        def text(target, xy, words, size=24, fill=ink, weight=500, anchor='la'):
            if weight not in self.vector_styles:
                shaper = hb.Font(face)
                shaper.scale = face.upem, face.upem
                shaper.set_variations({'wght': weight})
                glyph_set = font.getGlyphSet(location={'wght': weight})
                self.vector_styles[weight] = shaper, glyph_set, font.getGlyphOrder()
            shaper, glyph_set, glyph_order = self.vector_styles[weight]
            buffer = hb.Buffer()
            buffer.add_str(words)
            buffer.guess_segment_properties()
            hb.shape(shaper, buffer)
            scale = size/face.upem
            advance = sum(position.x_advance for position in buffer.glyph_positions)*scale
            x, y = xy
            if anchor == 'ra':
                x -= advance
            elif anchor == 'ma':
                x -= advance/2
            baseline = y+self.font(size, weight=weight).getmetrics()[0]
            uses, cursor = [], 0
            for info, position in zip(buffer.glyph_infos, buffer.glyph_positions):
                key = weight, info.codepoint
                identifier = f'g-{weight}-{info.codepoint}'
                if key not in self.vector_paths:
                    pen = SVGPathPen(glyph_set, ntos=lambda value: f'{value:.2f}'.rstrip('0').rstrip('.'))
                    glyph_set[glyph_order[info.codepoint]].draw(pen)
                    self.vector_paths[key] = pen.getCommands()
                path = self.vector_paths[key]
                if path:
                    glyph_definitions[identifier] = f'<path id="{identifier}" d="{path}"/>'
                    uses.append(f'<use href="#{identifier}" transform="translate({cursor+position.x_offset} {position.y_offset})"/>')
                cursor += position.x_advance
            target.elements.append(f'<g fill="{fill}" transform="translate({x:.3f} {baseline:.3f}) scale({scale:.6f} {-scale:.6f})">{"".join(uses)}</g>')

        def panel(width, height, fill=cream, radius=30):
            item = SvgLayer(width, height, identifiers, radius)
            item.rect((0, 0, width, height), fill, radius)
            return item

        def arrow(target, xy, size, color=ink, width=9):
            x, y = xy
            target.line([(x, y+size), (x+size, y)], color, width)
            target.line([(x, y), (x+size, y), (x+size, y+size)], color, width)

        def check(target, xy, size, color, width=6):
            x, y = xy
            target.line([(x, y+size*.55), (x+size*.35, y+size), (x+size, y)], color, width)

        def spark(x, y, radius, color):
            points = []
            for index in range(8):
                angle = index*math.pi/4
                length = radius if index % 2 == 0 else radius*.25
                points.append((x+math.cos(angle)*length, y+math.sin(angle)*length))
            scene.path('M'+' L'.join(f'{x:.2f} {y:.2f}' for x, y in points)+' Z', color)

        if n == 1:
            scene.ellipse((420, 0, 1020, 600), coral)
            scene.ellipse((-180, 360, 580, 1120), stroke='#b5a4c8', width=2)
            board = panel(730, 656)
            text(board, (38, 35), 'Overview', 35)
            for x in (614, 638, 662):
                board.ellipse((x, 52, x+9, 61), '#baa9c5')
            board.line([(38, 104), (692, 104)], '#e1d9d2', 2)
            board.rect((38, 139, 326, 254), '#ece4f3', 20)
            board.rect((346, 139, 692, 254), '#f4dac9', 20)
            board.line([(62, 220), (110, 190), (160, 205), (209, 170), (285, 171)], '#8f76a6', 4)
            board.line([(376, 215), (430, 209), (481, 176), (534, 189), (606, 161), (659, 172)], '#c37752', 4)
            board.rect((38, 282, 468, 610), '#eee8f3', 20)
            for index, height in enumerate((103, 156, 130, 213, 177, 254, 207)):
                x = 67+index*54
                board.rect((x, 575-height, x+32, 575), coral if index == 5 else '#a694bd', 9)
            for index, color in enumerate((ink, coral, lilac)):
                y = 306+index*103
                board.ellipse((510, y, 552, y+42), color)
                board.line([(575, y+12), (665, y+12)], '#b9acbd', 6)
                board.line([(575, y+31), (634, y+31)], '#ddd4df', 6)
            scene.place(board, (430, 433), 5)
            note = panel(422, 176, ink)
            note.ellipse((30, 34, 138, 142), stroke=lilac, width=12)
            check(note, (61, 70), 44, mint, 7)
            note.line([(184, 62), (323, 62)], cream, 9)
            note.line([(184, 97), (272, 97)], '#9e86ad', 7)
            arrow(note, (340, 113), 33, coral, 5)
            scene.place(note, (557, 874), -7)

        elif n == 2:
            scene.line([(210, 111), (690, 111), (690, 943), (210, 943)], '#ded3e5', 43)
            states = [
                ('Processing', lilac, ink, (410, 257), 7),
                ('Completed', ink, cream, (480, 546), -5),
                ('Review', coral, ink, (410, 833), 6),
            ]
            for index, (label, fill, color, center, angle) in enumerate(states):
                item = panel(654, 188, fill, 42)
                item.ellipse((33, 43, 135, 145), stroke=color, width=2)
                if index == 0:
                    item.path('M101 69 A30 30 0 1 0 106 113', stroke=color, width=6)
                elif index == 1:
                    check(item, (61, 76), 48, color, 6)
                else:
                    item.line([(84, 67), (84, 101)], color, 6)
                    item.ellipse((80, 116, 88, 124), color)
                text(item, (165, 61), label, 45, color)
                scene.place(item, center, angle)
            spark(756, 1020, 35, ink)

        elif n == 3:
            scene.ellipse((20, 290, 880, 1150), stroke='#b19cc8', width=2)
            scene.ellipse((80, 350, 820, 1090), stroke='#b19cc8', width=2)
            back = panel(650, 408, coral, 35)
            back.ellipse((344, 46, 620, 322), stroke=ink, width=2)
            back.ellipse((385, 87, 579, 281), stroke=ink, width=2)
            arrow(back, (52, 50), 74, ink, 8)
            scene.place(back, (425, 315), 14)
            card = panel(662, 422, ink, 35)
            text(card, (43, 36), 'Future Pay', 29, cream, weight=600)
            for offset in range(0, 192, 32):
                card.path(f'M{590+offset} -20 C{382+offset} 94 {382+offset} 304 {590+offset} 447', stroke='#6e5179', width=2)
            card.rect((45, 161, 143, 231), '#ddd1a4', 12)
            card.line([(78, 161), (78, 231)], '#9e9270', 2)
            card.line([(110, 161), (110, 231)], '#9e9270', 2)
            card.line([(45, 196), (143, 196)], '#9e9270', 2)
            for offset in (0, 14, 28):
                card.path(f'M{182+offset} {174-offset/2} Q{204+offset} 196 {182+offset} {218+offset/2}', stroke=lilac, width=3)
            for group in range(4):
                for dot in range(4):
                    x = 50+group*105+dot*18
                    card.ellipse((x, 309, x+7, 316), cream)
            card.line([(47, 367), (183, 367)], '#9e86ad', 6)
            scene.place(card, (474, 574), -12)
            controls = panel(474, 144)
            controls.path('M44 64 V48 A18 18 0 0 1 80 48 V64', stroke=ink, width=4)
            controls.rect((35, 62, 89, 108), lilac, 11)
            controls.line([(124, 63), (260, 63)], '#95809f', 7)
            controls.line([(124, 91), (214, 91)], '#d4c7db', 6)
            controls.rect((353, 46, 443, 98), ink, 26)
            controls.ellipse((395, 53, 435, 93), mint)
            scene.place(controls, (440, 948), 4)

        elif n == 4:
            scene.rect((75, 244, 835, 852), radius=190, stroke='#d99d8b', width=2)
            sheet = panel(610, 744)
            text(sheet, (38, 37), 'Review', 39)
            sheet.ellipse((506, 38, 568, 100), lilac)
            check(sheet, (524, 57), 25, ink, 4)
            sheet.line([(38, 132), (572, 132)], '#e0d5db', 2)
            sheet.line([(67, 217), (67, 491)], '#d6c8df', 3)
            for index in range(3):
                y = 191+index*130
                sheet.ellipse((40, y, 94, y+54), ink if index == 2 else '#e7ddef')
                if index < 2:
                    check(sheet, (56, y+18), 22, ink, 4)
                else:
                    arrow(sheet, (57, y+17), 20, cream, 3)
                sheet.line([(124, y+15), (455-index*35, y+15)], '#8d7897', 9)
                sheet.line([(124, y+43), (352+index*33, y+43)], '#d9cedd', 7)
            sheet.rect((38, 611, 572, 698), ink, 22)
            arrow(sheet, (492, 637), 33, cream, 5)
            scene.place(sheet, (450, 514), -5)
            spark(749, 155, 52, ink)
            note = panel(272, 116, coral, 24)
            note.ellipse((25, 27, 85, 87), ink)
            check(note, (43, 47), 24, cream, 4)
            note.line([(114, 44), (228, 44)], ink, 7)
            note.line([(114, 74), (190, 74)], '#b45636', 5)
            scene.place(note, (598, 948), 7)

        elif n == 5:
            scene.ellipse((403, 74, 1023, 694), '#553b60')
            scene.ellipse((-214, 417, 596, 1227), stroke='#775a80', width=2)
            site = panel(724, 657)
            text(site, (37, 30), 'Bit2Go', 30, weight=600)
            site.rect((569, 33, 680, 75), ink, 21)
            arrow(site, (629, 46), 15, cream, 3)
            site.line([(37, 108), (686, 108)], '#ded5d5', 2)
            site.line([(40, 187), (331, 187)], ink, 22)
            site.line([(40, 239), (272, 239)], '#b7a5c4', 22)
            site.line([(40, 305), (241, 305)], '#d5c7dc', 8)
            site.rect((38, 375, 232, 432), lilac, 28)
            arrow(site, (175, 392), 22, ink, 4)
            site.ellipse((362, 281, 689, 608), coral)
            arrow(site, (444, 369), 145, ink, 17)
            scene.place(site, (451, 502), 7)
            ring = SvgLayer(244, 244, identifiers)
            ring.ellipse((22, 22, 222, 222), stroke=lilac, width=43)
            scene.place(ring, (181, 932), -8)
            spark(731, 954, 50, coral)

        elif n == 6:
            scene.ellipse((30, 157, 870, 997), '#c9bbda')
            desktop = panel(710, 513, ink, 24)
            desktop.rect((12, 12, 698, 501), cream, 17)
            desktop.ellipse((35, 30, 67, 62), coral)
            desktop.line([(36, 98), (674, 98)], '#dfd5dc', 2)
            desktop.line([(40, 169), (359, 169)], ink, 20)
            desktop.line([(40, 215), (285, 215)], '#b09abd', 20)
            desktop.line([(40, 278), (239, 278)], '#dbd0e1', 7)
            desktop.rect((38, 346, 243, 401), ink, 27)
            arrow(desktop, (186, 363), 22, cream, 4)
            desktop.rect((451, 134, 673, 459), lilac, 110)
            arrow(desktop, (504, 249), 107, ink, 12)
            scene.place(desktop, (386, 419), 6)
            phone = panel(255, 499, ink, 43)
            phone.rect((10, 10, 245, 489), cream, 34)
            phone.rect((84, 19, 171, 36), ink, 9)
            phone.ellipse((29, 73, 57, 101), coral)
            phone.line([(30, 147), (201, 147)], ink, 12)
            phone.line([(30, 180), (159, 180)], '#b09abd', 12)
            phone.rect((28, 232, 227, 389), coral, 24)
            arrow(phone, (92, 280), 69, ink, 9)
            phone.rect((28, 417, 227, 461), ink, 22)
            arrow(phone, (179, 431), 15, cream, 3)
            scene.place(phone, (649, 757), -9)
            spark(180, 944, 48, ink)

        elif n == 7:
            scene.line([(164, 167), (735, 167), (735, 530), (170, 530), (170, 920), (642, 920)], '#dc946e', 3)
            steps = [
                ('Set up', cream, ink, (354, 235), 6),
                ('Review', ink, cream, (526, 548), -5),
                ('Done', cream, ink, (364, 865), 5),
            ]
            for index, (label, fill, color, center, angle) in enumerate(steps):
                item = panel(571, 208, fill, 30)
                item.rect((25, 28, 171, 180), lilac if index == 1 else '#e7ddf0', 25)
                if index == 0:
                    item.ellipse((80, 57, 118, 95), stroke=ink, width=4)
                    item.path('M62 144 C62 99 136 99 136 144', stroke=ink, width=4)
                elif index == 1:
                    for y in (66, 103, 140):
                        item.rect((61, y-8, 78, y+9), radius=3, stroke=ink, width=3)
                        item.line([(95, y), (135, y)], ink, 4)
                else:
                    check(item, (66, 81), 65, ink, 8)
                text(item, (210, 73), label, 43, color)
                scene.place(item, center, angle)
            spark(756, 1000, 40, ink)

        else:
            for radius in (270, 350, 430):
                scene.ellipse((445-radius, 566-radius, 445+radius, 566+radius), stroke='#62486e', width=2)
            board = panel(690, 745)
            text(board, (36, 35), 'Workspace', 35, weight=550)
            board.ellipse((613, 42, 649, 78), coral)
            board.line([(36, 114), (654, 114)], '#e4d9de', 2)
            for index in range(3):
                x = 36+index*213
                board.rect((x, 148, x+190, 196), lilac if index == 0 else '#eee6e0', 24)
            board.rect((36, 237, 654, 462), ink, 23)
            for y in (290, 347, 407):
                board.line([(64, y), (626, y)], '#614b6e', 1)
            board.line([(64, 420), (143, 390), (223, 403), (306, 345), (386, 357), (467, 306), (542, 321), (622, 278)], lilac, 5)
            board.ellipse((614, 270, 630, 286), mint)
            for index in range(3):
                y = 507+index*70
                board.ellipse((38, y, 76, y+38), coral if index == 0 else lilac)
                board.line([(101, y+11), (298, y+11)], '#a592b0', 7)
                board.line([(101, y+30), (235, y+30)], '#d9cedd', 6)
                board.rect((495, y+10, 650, y+28), '#e5dbea', 9)
            scene.place(board, (435, 493), -5)
            note = panel(397, 132, lilac)
            for index, height in enumerate((29, 50, 70, 43, 80)):
                x = 36+index*43
                note.rect((x, 103-height, x+23, 103), ink, 7)
            arrow(note, (310, 43), 40, ink, 6)
            scene.place(note, (568, 955), 7)

        image.place(scene, (450, 753), shadow=False)
        text(image, (58, 51), brand, 38, foreground, weight=600)
        text(image, (842, 62), f'{n:02} / {len(GALLERY_STUDIES):02}', 20, foreground, anchor='ra')
        image.line([(58, 124), (842, 124)], foreground, 1)
        text(image, (58, 1334), discipline, 20, foreground)
        text(image, (842, 1375), 'UI CONCEPT', 16, foreground, anchor='ra')
        shadow = '<filter id="shadow" x="-35%" y="-35%" width="180%" height="190%"><feDropShadow dx="0" dy="18" stdDeviation="13" flood-color="#30203d" flood-opacity=".16"/></filter>'
        title = escape(f'{brand} / {discipline} — vector concept artwork')
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title"><title id="title">{title}</title><defs>{shadow}{"".join(glyph_definitions.values())}</defs>{"".join(image.elements)}</svg>'
        destination = self.output/f'gallery-{n:02}.svg'
        destination.write_text(svg, encoding='utf-8')
        print(f'{destination.name}: vector geometry and outlined text; {destination.stat().st_size:,} bytes')


def footer_art(studio):
    """Flat colour, sparse typography and a few original black-ink gestures."""
    root = studio.output / 'footer'
    root.mkdir(parents=True, exist_ok=True)
    scale = 2
    size = (900*scale,1230*scale)
    ink, ivory, lilac, lemon, coral = '#201923','#f1edde','#c5b8e9','#f2ed65','#ff6843'

    def units(values):
        return tuple(round(value*scale) for value in values)

    def text(image,word,xy,font_size=40,italic=False,color=ink,weight=400):
        studio.text(image,units(xy),word,font_size*scale,color,italic=italic,
                    weight=weight,anchor='lt')

    def stroke(image,points,width=4,color=ink):
        ImageDraw.Draw(image).line([units(p) for p in points],fill=color,
                                   width=round(width*scale),joint='curve')

    def path_text(image,words,points,font_size=35):
        font = studio.font(font_size*scale,italic=True,weight=400)
        advances = [font.getlength(char)/scale for char in words]
        lengths = [0]
        for a,b in zip(points,points[1:]):
            lengths.append(lengths[-1]+math.hypot(b[0]-a[0],b[1]-a[1]))
        spacing = lengths[-1]/sum(advances)
        cursor, segment = 0, 0
        for char,advance in zip(words,advances):
            distance = (cursor+advance/2)*spacing
            while segment<len(points)-2 and lengths[segment+1]<distance:
                segment += 1
            a,b = points[segment:segment+2]
            fraction = (distance-lengths[segment])/(lengths[segment+1]-lengths[segment])
            if not char.isspace():
                glyph = Image.new('RGBA',units((font_size*3,font_size*3)))
                ImageDraw.Draw(glyph).text((glyph.width/2,glyph.height/2),char,
                                          font=font,fill=ink,anchor='ms')
                center = units((a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction))
                studio.place(image,glyph,center,-math.degrees(math.atan2(b[1]-a[1],b[0]-a[0])),
                             shadow=False)
            cursor += advance

    def finish(image,name):
        save_webp(image.resize((900,1230),Image.Resampling.LANCZOS).convert('RGB'),
                  root/f'{name}.webp',lossless=True)

    # A wandering sentence and one unruly ink line, surrounded by untouched cream.
    image = Image.new('RGBA',size,ivory)
    points = [(450+170*math.sin(t*math.pi*2.6-.6),244+496*t)
              for t in (i/800 for i in range(801))]
    path_text(image,'a curious mind, an open conversation. a curious mind, an open conversation.',points,35)
    points = [(450+252*math.sin(t*2.7+.3)*(1-.035*t),
               700+164*math.sin(t*3.8)+27*math.cos(t*1.7))
              for t in (i*7.4/1600 for i in range(1601))]
    stroke(image,points,6)
    text(image,'thoughts', (93,1042),30)
    text(image,'in motion.', (93,1075),30)
    text(image,'rochelle', (588,1067),35,True)
    finish(image,'perspective')

    # The additional brand reference contributes compressed bold type and one sign.
    image = Image.new('RGBA',size,lilac)
    text(image,'MAKE',(65,142),166,weight=800)
    text(image,'ROOM.',(65,293),166,weight=800)
    center = (463,782)
    for i in range(8):
        angle = i*math.tau/8+.16
        stroke(image,[(center[0]+42*math.cos(angle),center[1]+42*math.sin(angle)),
                      (center[0]+211*math.cos(angle),center[1]+211*math.sin(angle))],23)
    text(image,'for a little',(580,1076),30)
    text(image,'curiosity.',(580,1110),30)
    finish(image,'angles')

    # A deliberately quiet yellow card: three small, offset typographic islands.
    image = Image.new('RGBA',size,lemon)
    text(image,'a little',(127,197),40,True)
    text(image,'curiosity.',(170,239),40,True)
    text(image,'oh, what',(371,552),58,True)
    text(image,'if we',(402,609),58)
    text(image,'tried this?',(355,665),58,True)
    text(image,'room to',(662,1010),35,True)
    text(image,'play.',(707,1048),35,True)
    finish(image,'curiosity')

    # A flat orange typographic poster, with no paper, bevels or faux objects.
    image = Image.new('RGBA',size,coral)
    text(image,'GOOD',(64,148),143,weight=800)
    text(image,'THINGS',(64,278),143,weight=800)
    text(image,'AHEAD.',(64,408),143,weight=800)
    d = ImageDraw.Draw(image)
    d.ellipse(units((251,747,649,1003)),outline=ink,width=5*scale)
    d.ellipse(units((341,747,559,1003)),outline=ink,width=4*scale)
    d.line(units((251,875,649,875)),fill=ink,width=4*scale)
    d.arc(units((258,784,642,900)),0,180,fill=ink,width=4*scale)
    d.arc(units((258,850,642,966)),180,360,fill=ink,width=4*scale)
    text(image,'different minds.',(63,1100),29)
    text(image,'shared possibilities.',(550,1100),29)
    finish(image,'thread')

    # An open circular sentence: lighter than a fifth headline or illustration.
    image = Image.new('RGBA',size,ivory)
    points = [(449+223*math.cos(t),602+223*math.sin(t))
              for t in (-2.75+i*5.65/1000 for i in range(1001))]
    path_text(image,'thoughtfully, playfully. always becoming.',points,39)
    text(image,'r.',(396,525),136,True)
    text(image,'never quite',(108,1018),35,True)
    text(image,'finished.',(160,1059),35,True)
    finish(image,'worlds')


def main():
    base=Path(__file__).resolve().parent
    parser=ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path,nargs='?',help='Folder containing the supplied original PNGs')
    parser.add_argument('--output',type=Path,default=base/'assets/editorial')
    parser.add_argument('--artwork-output',type=Path,default=base/'artworks',help='Directory for reusable transparent collage PNGs, separate from browser assets')
    parser.add_argument('--sans-font',type=Path,default=base/'assets/fonts/outfit-variable.ttf')
    parser.add_argument('--serif-font',type=Path,default=base/'assets/fonts/fraunces-italic-variable.ttf')
    parser.add_argument('--footer-only',action='store_true',help='Generate five flat colour typographic footer designs using bundled fonts')
    parser.add_argument('--collage-only',action='store_true',help='Generate original paper collages using only bundled fonts')
    parser.add_argument('--covers-only',action='store_true',help='Generate twelve mixed-media collage covers and transparent source artworks')
    parser.add_argument('--gallery-only',action='store_true',help='Generate eight text-light SVG homepage covers without changing Work or case-study assets')
    args=parser.parse_args()
    if args.gallery_only:
        args.output.mkdir(parents=True,exist_ok=True)
        studio=Studio(args.output,args.sans_font,args.serif_font)
        for n in range(1,len(GALLERY_STUDIES)+1):
            studio.gallery_cover(n)
        return
    if args.covers_only:
        args.output.mkdir(parents=True,exist_ok=True)
        studio=Studio(args.output,args.sans_font,args.serif_font)
        for n in range(1,13):
            studio.cover(n,args.artwork_output)
        return
    if args.collage_only:
        args.output.mkdir(parents=True,exist_ok=True)
        studio=Studio(args.output,args.sans_font,args.serif_font)
        for n in range(1,13):
            studio.cover(n,args.artwork_output)
        save_webp(studio.collage(),args.output/'cta-collage.webp',91)
        return
    if args.footer_only:
        footer_art(Studio(args.output,args.sans_font,args.serif_font))
        return
    if args.source is None or not args.source.is_dir():
        parser.error('Source must be an existing PNG folder, unless --footer-only, --collage-only or --covers-only is used.')
    args.output.mkdir(parents=True,exist_ok=True)
    for i,name in enumerate(LIFESTYLE,1):
        image=Image.open(args.source/f'已生成图像 {name}.png').convert('RGB')
        image.thumbnail((900,900),Image.Resampling.LANCZOS)
        save_webp(image,args.output/f'life-{i:02}.webp',86)
    for name,fragment in PORTRAITS.items():
        image=source_image(args.source,fragment)
        image.thumbnail((850,1510),Image.Resampling.LANCZOS)
        save_webp(image,args.output/f'portrait-{name}.webp',86)
    for i,fragment in enumerate(GRADIENTS,1):
        image=source_image(args.source,fragment)
        image.thumbnail((700,1244),Image.Resampling.LANCZOS)
        save_webp(image,args.output/f'gradient-{i:02}.webp',84)
    for font in (args.sans_font,args.serif_font):
        if not font.is_file():
            parser.error(f'Missing font: {font}. Supply an explicit --sans-font or --serif-font.')
    studio=Studio(args.output,args.sans_font,args.serif_font)
    for n in range(1,13):
        studio.cover(n,args.artwork_output)
    for n in range(1,len(GALLERY_STUDIES)+1):
        studio.gallery_cover(n)
    save_webp(studio.collage(),args.output/'cta-collage.webp',91)
    footer_art(studio)


if __name__=='__main__':
    main()
