#!/usr/bin/env python3
"""Đối chiếu test-matrix.md với các Karate feature của một lần chạy.

Cách dùng:  python check_coverage.py executions/<run-id>

Kiểm tra:
  LỖI   - ca đã duyệt (Y hoặc S) nhưng không có Scenario mang thẻ @ID
  LỖI   - Scenario mang thẻ @ID không có trong matrix, hoặc ca đó bị loại (N) / chưa duyệt
  CẢNH BÁO - Scenario không có thẻ @ID
  CẢNH BÁO - Scenario không có dòng 'match' nào (chỉ kiểm mã trạng thái: dấu hiệu test xanh giả)
Thoát với mã 1 nếu có LỖI, mã 0 nếu không.
"""
import re
import sys
from pathlib import Path

ID_RE = re.compile(r'^[A-Z]{2,4}\d{2,3}$')


def read_matrix(path):
    """Trả về {ID: giá trị cột Duyệt (chữ hoa, có thể rỗng)}."""
    result, header = {}, None
    for line in path.read_text(encoding='utf8').splitlines():
        line = line.strip()
        if not line.startswith('|'):
            continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if cells and cells[0].lower() == 'id':
            header = [c.lower() for c in cells]
            continue
        if header and cells and ID_RE.match(cells[0]) and 'duyệt' in header:
            idx = header.index('duyệt')
            result[cells[0]] = cells[idx].upper() if idx < len(cells) else ''
    return result


def read_features(folder):
    """Trả về danh sách (tệp, tên scenario, [thẻ ID], có_match)."""
    found = []
    for f in sorted(folder.glob('*.feature')):
        tags, current = [], None
        for raw in f.read_text(encoding='utf8').splitlines():
            line = raw.strip()
            if line.startswith('@'):
                tags += line.split()
            elif line.startswith(('Scenario:', 'Scenario Outline:')):
                if current:
                    found.append(current)
                ids = [t[1:] for t in tags if ID_RE.match(t[1:])]
                current = {'file': f.name, 'name': line, 'ids': ids, 'match': False}
                tags = []
            elif line.startswith(('Feature:', 'Background:')):
                if current:
                    found.append(current)
                current, tags = None, []
            elif current and re.match(r'^(\*|And|Then|Given|When)\s+match\b', line):
                current['match'] = True
        if current:
            found.append(current)
    return found


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    run = Path(sys.argv[1])
    matrix_path, feat_dir = run / 'test-matrix.md', run / 'features'
    if not matrix_path.exists() or not feat_dir.exists():
        print(f'Không thấy {matrix_path} hoặc thư mục {feat_dir}')
        return 2

    matrix = read_matrix(matrix_path)
    approved = {i for i, d in matrix.items() if d in ('Y', 'S')}
    scenarios = read_features(feat_dir)
    covered = {i for s in scenarios for i in s['ids']}
    errors, warnings = [], []

    for i in sorted(approved - covered):
        errors.append(f'Ca {i} đã duyệt nhưng chưa có Scenario mang thẻ @{i}')
    for s in scenarios:
        if not s['ids']:
            warnings.append(f"{s['file']}: không có thẻ @ID: {s['name']}")
        for i in s['ids']:
            if i not in matrix:
                errors.append(f"{s['file']}: @{i} không có trong matrix")
            elif i not in approved:
                errors.append(f"{s['file']}: @{i} chưa được duyệt hoặc đã bị loại (N)")
        if not s['match']:
            warnings.append(f"{s['file']}: không có dòng match (chỉ kiểm mã trạng thái?): {s['name']}")

    print(f'Matrix: {len(matrix)} ca, đã duyệt {len(approved)}. Feature: {len(scenarios)} scenario.')
    for e in errors:
        print('LỖI     ', e)
    for w in warnings:
        print('CẢNH BÁO', w)
    if not errors and not warnings:
        print('Sạch: mọi ca đã duyệt đều có scenario, không có scenario thừa hay thiếu match.')
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
