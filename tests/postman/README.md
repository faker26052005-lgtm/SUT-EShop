# Postman & Newman API Test Suite
- **Phụ trách chính:** Kiên (P1, P2), Tú (P3).
- `collections/`: Chứa file Postman Collection JSON.
- `environments/`: Chứa biến môi trường local (không lưu password/secret).
- `data/`: Chứa file CSV/JSON chạy data-driven.
- `newman/`: Chứa script chạy tự động Newman CLI và báo cáo HTML.

### Lệnh chạy Newman mẫu:
```bash
newman run collections/eshop_collection.json -e environments/local.json -r cli,htmlextra
```
