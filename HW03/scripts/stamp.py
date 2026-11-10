#!/usr/bin/env python3
"""Đóng dấu (overlay) dòng chữ nhận diện lên ảnh chụp màn hình cho Task 3.

Đề yêu cầu mỗi ảnh phải có email sinh viên chồng lên ảnh, và ảnh phải thể hiện rõ
trình duyệt / hệ điều hành / thiết bị. Script này thêm một dải chữ vào ảnh thật
mà bạn đã tự chụp (không tạo hay chỉnh nội dung ảnh).

Cần cài một lần:   pip install pillow

Ví dụ:
  python scripts/stamp.py shots/chrome --text "email@student.edu.vn | MSSV 12345678 | Ho Ten | Chrome 130 / Windows 11"
  python scripts/stamp.py shots/chrome/UI-12.png --text "..." --out stamped

Mặc định ảnh mới được ghi vào thư mục <nguồn>_stamped, ảnh gốc không bị thay đổi.
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Thiếu thư viện Pillow. Cài bằng lệnh: pip install pillow")

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\tahoma.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]
EXTS = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}


def load_font(size):
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def wrap_text(draw, text, font, max_w):
    """Ngắt dòng theo từng đoạn ngăn cách bằng ' | ' (và theo từ nếu một đoạn vẫn quá dài)."""
    parts = text.split(" | ")
    lines, cur = [], ""
    for part in parts:
        cand = part if not cur else cur + " | " + part
        if draw.textlength(cand, font=font) <= max_w:
            cur = cand
            continue
        if cur:
            lines.append(cur)
        cur = ""
        words, line = part.split(" "), ""
        for wd in words:
            c2 = wd if not line else line + " " + wd
            if draw.textlength(c2, font=font) <= max_w:
                line = c2
            else:
                if line:
                    lines.append(line)
                line = wd
        cur = line
    if cur:
        lines.append(cur)
    return lines


def stamp_image(src, dst, text, position):
    img = Image.open(src).convert("RGB")
    w, h = img.size
    pad = max(6, w // 200)
    size = max(13, min(w // 55, 30))
    font = load_font(size)
    probe = ImageDraw.Draw(img)
    lines = wrap_text(probe, text, font, w - 2 * pad)
    line_h = probe.textbbox((0, 0), "Ag", font=font)[3] + 4
    band_h = line_h * len(lines) + 2 * pad
    out = Image.new("RGB", (w, h + band_h), (0, 0, 0))
    y_img = band_h if position == "top" else 0
    out.paste(img, (0, y_img))
    y_band = 0 if position == "top" else h
    d2 = ImageDraw.Draw(out)
    d2.rectangle([0, y_band, w, y_band + band_h], fill=(20, 20, 20))
    for k, line in enumerate(lines):
        d2.text((pad, y_band + pad + k * line_h), line, font=font, fill=(255, 255, 255))
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst.with_suffix(".png"))


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src", help="một file ảnh hoặc một thư mục chứa ảnh")
    ap.add_argument("--text", required=True, help="dòng chữ cần đóng dấu (email, MSSV, họ tên, nền tảng...)")
    ap.add_argument("--out", help="thư mục ghi ảnh mới (mặc định: <nguồn>_stamped)")
    ap.add_argument("--position", choices=["top", "bottom"], default="bottom", help="vị trí dải chữ")
    a = ap.parse_args()

    src = Path(a.src)
    if not src.exists():
        sys.exit("Không thấy %s" % src)
    files = [src] if src.is_file() else sorted(p for p in src.iterdir() if p.suffix.lower() in EXTS)
    if not files:
        sys.exit("Không có ảnh nào trong %s" % src)
    out_dir = Path(a.out) if a.out else (src.parent / (src.stem + "_stamped") if src.is_file() else src.parent / (src.name + "_stamped"))
    for f in files:
        stamp_image(f, out_dir / f.name, a.text, a.position)
        print("Đã đóng dấu:", f.name)
    print("Ảnh mới nằm trong:", out_dir)


if __name__ == "__main__":
    main()
