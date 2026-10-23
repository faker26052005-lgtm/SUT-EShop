#!/usr/bin/env python3
"""Tạo bản OpenAPI dành cho Agent từ bản gốc (master) có đáp án.

Cách dùng:
    python tools/make_agent_openapi.py <master.yaml> inputs/openapi.yaml

Bản master (có khóa x-known-deviations, ghi chú mã lỗi B, nhắc Postman) phải để NGOÀI
thư mục workspace mà Agent đọc được, ví dụ ../_private/openapi.master.yaml.

Script làm:
  1. Xóa mọi khối có khóa bắt đầu bằng "x-known-deviations" (cả các dòng con thụt vào sâu hơn).
  2. Xóa dòng chú thích "#" nhắc mã lỗi B hoặc Postman; cắt phần chú thích cuối dòng tương tự.
  3. Cắt các câu trong dòng mô tả có nhắc mã lỗi B hoặc Postman.
  4. Quét lại bản kết quả. Còn dấu vết thì in ra và thoát với mã 1 để người xử lý tay.
Kiểm tra cú pháp YAML nếu máy có thư viện PyYAML.
"""
import re
import sys
from pathlib import Path

LEAK = re.compile(r'x-known|Postman|\bB\d{1,2}\b|\bO\d\b', re.IGNORECASE)
KEYS = re.compile(r'^\s*x-known-deviations\b')


def indent(line):
    return len(line) - len(line.lstrip(' '))


def clean(text):
    out, skip_indent = [], None
    for line in text.splitlines():
        if skip_indent is not None:
            if line.strip() == '' or indent(line) > skip_indent:
                continue
            skip_indent = None
        if KEYS.match(line):
            skip_indent = indent(line)
            continue
        stripped = line.strip()
        if stripped.startswith('#'):
            if LEAK.search(stripped):
                continue
            out.append(line)
            continue
        m = re.search(r'\s+#\s.*$', line)          # chú thích cuối dòng
        if m and LEAK.search(m.group(0)):
            line = line[:m.start()]
        if LEAK.search(line):                       # câu mô tả có nhắc mã lỗi
            head = re.match(r'^(\s*(?:-\s+)?(?:[\w\-]+:\s+)?)(.*)$', line)
            prefix, body = head.group(1), head.group(2)
            sentences = re.split(r'(?<=[.!?])\s+', body)
            kept = [s for s in sentences if not LEAK.search(s)]
            if not kept and prefix.strip() and not prefix.strip().endswith(':'):
                continue                            # cả dòng chỉ là câu cần xóa
            line = prefix + ' '.join(kept)
            if not line.strip():
                continue
        out.append(line.rstrip())
    return '\n'.join(out) + '\n'


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    result = clean(src.read_text(encoding='utf8'))
    dst.write_text(result, encoding='utf8')
    print(f'Đã ghi {dst} ({len(result.splitlines())} dòng) từ {src}')
    try:
        import yaml
        yaml.safe_load(result)
        print('Cú pháp YAML hợp lệ.')
    except ImportError:
        print('Chưa kiểm tra cú pháp YAML (không có PyYAML: pip install pyyaml).')
    except Exception as e:
        print('CẢNH BÁO: YAML không hợp lệ sau khi làm sạch:', e)
        return 1
    leaks = [(i, l) for i, l in enumerate(result.splitlines(), 1) if LEAK.search(l)]
    for i, l in leaks:
        print(f'CÒN DẤU VẾT dòng {i}: {l.strip()[:120]}')
    return 1 if leaks else 0


if __name__ == '__main__':
    sys.exit(main())
