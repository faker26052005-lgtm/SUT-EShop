# Skill: api-test-design
Áp dụng cho AI Agent thiết kế test API và sinh file Karate feature từ đặc tả OpenAPI đã review.

## Quy tắc thiết kế test:
1. Đọc OpenAPI spec được chỉ định, không tự suy diễn endpoint hoặc response body.
2. Thiết lập test matrix phân loại: Positive, Negative, Boundary.
3. Chờ human review duyệt test matrix trước khi viết file feature.
4. Ghi file feature vào thư mục `tests/karate/src/test/java/eshop/generated/`.
5. Không bao giờ hardcode secret, mật khẩu hay token nhạy cảm vào test code.
