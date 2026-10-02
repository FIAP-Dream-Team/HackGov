"""Rasterize the Fase 2 PDF into 1920x1080 JPEGs and patch the video frames.

Edits applied only to the JPEG the Remotion composition plays — the PDF the
group submits is not touched:

  - Slide 11: spoken 60% instead of the printed 65%.
  - Slides 1 and 12: drop '[colar link]' (this file is the video).

Requires: pip install pypdfium2 pillow
"""
from __future__ import annotations

from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
PDF = ROOT.parent / "fase-2" / "HackGov_Minha_Vez__Fase_2.pdf"
OUT = ROOT / "public" / "fase-2"
FONT_PATH = HERE / "fonts" / "Figtree-ExtraBold.ttf"

WIDTH, HEIGHT = 1920, 1080
WHITE = (255, 255, 255)


def fig(size: int, weight: int) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(FONT_PATH), size)
    font.set_variation_by_axes([weight])
    return font


def stamp_green(
    image: Image.Image,
    dest: tuple[int, int, int, int],
    sample: tuple[int, int, int, int],
) -> None:
    """Cover dest with a crop of nearby card green so JPEG noise matches."""
    patch = image.crop(sample)
    left, top, right, bottom = dest
    for y in range(top, bottom, patch.height):
        for x in range(left, right, patch.width):
            cropped = patch.crop((0, 0, min(patch.width, right - x), min(patch.height, bottom - y)))
            image.paste(cropped, (x, y))


def rasterize() -> list[Image.Image]:
    pdf = pdfium.PdfDocument(str(PDF))
    pages: list[Image.Image] = []
    for page in pdf:
        width_pt, _height_pt = page.get_size()
        scale = WIDTH / width_pt
        bitmap = page.render(scale=scale, rev_byteorder=True)
        image = bitmap.to_pil().convert("RGB")
        if image.size != (WIDTH, HEIGHT):
            image = image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
        pages.append(image)
    if len(pages) != 12:
        raise SystemExit(f"PDF should have 12 pages, got {len(pages)}")
    return pages


def center_text(
    image: Image.Image,
    box: tuple[int, int, int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
) -> None:
    draw = ImageDraw.Draw(image)
    left, top, right, bottom = box
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = left + (right - left - tw) // 2 - bbox[0]
    y = top + (bottom - top - th) // 2 - bbox[1]
    draw.text((x, y), text, font=font, fill=fill)


def patch_slide_01(image: Image.Image) -> None:
    """Drop the 'VÍDEO DO PROJETO / [colar link]' card — this file is the video."""
    stamp_green(image, (1418, 818, 1800, 962), (1500, 400, 1700, 600))


def patch_slide_12(image: Image.Image) -> None:
    """Drop the footer line 'Vídeo: [colar link]'."""
    stamp_green(image, (118, 916, 420, 954), (118, 960, 400, 1020))


def patch_slide_11(image: Image.Image) -> None:
    """65% → 60%. Drop '35% + 30%' so the card does not still add to 65."""
    # Second digit of the big number (the 5 of 65%). 6 and % stay from the PDF.
    stamp_green(image, (288, 368, 382, 490), (145, 400, 185, 470))
    center_text(image, (288, 360, 382, 492), "0", fig(132, 800), WHITE)

    # Subline: "Ortopedia (180 dias) 35% + Cardiologia (120 dias) 30%"
    stamp_green(image, (160, 672, 920, 712), (160, 718, 280, 748))
    draw = ImageDraw.Draw(image)
    draw.text(
        (186, 682),
        "Ortopedia (180 dias) e Cardiologia (120 dias)",
        font=fig(21, 500),
        fill=(186, 244, 219),
    )


def main() -> None:
    if not PDF.exists():
        raise SystemExit(f"PDF not found: {PDF}")
    OUT.mkdir(parents=True, exist_ok=True)
    pages = rasterize()
    patch_slide_01(pages[0])
    patch_slide_11(pages[10])
    patch_slide_12(pages[11])
    for index, page in enumerate(pages, start=1):
        dest = OUT / f"{index:02d}.jpg"
        page.save(dest, "JPEG", quality=94, optimize=True)
        print(f"  {dest.name}  {dest.stat().st_size} bytes")
    print(f"Wrote {len(pages)} slides -> {OUT}")


if __name__ == "__main__":
    main()
