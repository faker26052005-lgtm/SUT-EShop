/*
Bước 1. Đối chiếu KẾ HOẠCH với CODE
| Mã Test | Có trong code chưa? |
|---------|---------------------|
| T01     | Có (Phần 1)         |
| T02     | Có (Phần 1)         |
| T03     | Có (Phần 1)         |
| T04     | Có (Phần 1)         |
| T05     | Có (Phần 1)         |
| T06     | Có (Phần 1)         |
| T07     | Có (Phần 1)         |
| T08     | Có (Phần 1)         |
| T09     | Có (Phần 2)         |
| T10     | Có (Phần 2)         |
| T11     | Có (Phần 2)         |
| T12     | Có (Phần 2)         |
| T13     | Có (Phần 2)         |
| T14     | Có (Phần 2)         |
| T15     | Có (Phần 1)         |
| T16     | Có (Phần 2)         |
| T17     | Có (Phần 2)         |
| T18     | Có (Phần 1)         |
| T19     | Có (Phần 1)         |
| T20     | Có (Phần 2)         |

Bước 2. Đối chiếu bảng phủ (Các mục còn thiếu)
- Endpoints chưa có test: 
  + `GET /api/cart`
  + `GET /api/orders/my-orders`
  + `POST /api/coupon-usage`
  + `GET /api/coupons`
  + `GET /api/admin/users`
  + `GET /api/admin/orders`
  + `/api/products/{id}` (GET, PUT, DELETE)
  + `/api/categories/{id}` (PUT, DELETE)
  + `/api/admin/coupons/{id}` (DELETE)
- Endpoints chưa đủ 1 đường đi đúng + 1 âm tính/bảo mật:
  + `POST /api/forgot-password` (thiếu âm tính: email không tồn tại)
  + Các API bảo mật (thiếu test 401 khi không có token - OWASP API2)
  + Các API CRUD cho Admin (thiếu đường đi đúng tạo/sửa/xóa, API5)
  + `PUT /api/orders/{id}/cancel` (thiếu đường đi đúng: hủy hợp lệ)
  + `POST /api/apply-coupon` (thiếu đường đi đúng: áp dụng hợp lệ)
  + `PUT /api/admin/orders/{id}/status` (thiếu đường đi đúng: cập nhật trạng thái hợp lệ)
*/

async function aiTestsPart3(ctx) {
  // Mục tiêu: Yêu cầu OTP với email không tồn tại. Tham chiếu: API2
  const t21Forgot = await ctx.call("POST", "/api/forgot-password", { body: { email: "notfound@test.com" } });
  pm.test("T21 Quên mật khẩu báo lỗi 404 nếu email không tồn tại", function () {
    pm.expect(t21Forgot.code).to.equal(404);
  });

  // Mục tiêu: Thiếu token bị từ chối 401. Tham chiếu: API2, SEC-02
  const t22NoToken = await ctx.call("GET", "/api/users/me");
  pm.test("T22 Truy cập API bảo mật không có token bị từ chối 401", function () {
    pm.expect(t22NoToken.code).to.equal(401);
  });

  // Mục tiêu: Admin tạo, cập nhật, lấy chi tiết, và xóa sản phẩm hợp lệ. Tham chiếu: FR-15, API5
  const t23ProdName = "T23-Prod-" + ctx.RUN;
  const t23Create = await ctx.call("POST", "/api/products", { token: ctx.ADMIN, body: { name: t23ProdName, price: 1000, category_id: 1 } });
  let t23Get, t23Update, t23Delete;
  if (t23Create.code === 200) {
    const pId = t23Create.json.id;
    t23Get = await ctx.call("GET", "/api/products/" + pId);
    t23Update = await ctx.call("PUT", "/api/products/" + pId, { token: ctx.ADMIN, body: { name: t23ProdName + " Updated", price: 2000, category_id: 1 } });
    t23Delete = await ctx.call("DELETE", "/api/products/" + pId, { token: ctx.ADMIN });
  }
  pm.test("T23 Admin CRUD Sản phẩm (Đường đi đúng)", function () {
    pm.expect(t23Create.code, "Tạo thành công").to.equal(200);
    pm.expect(t23Get.code, "Lấy chi tiết thành công").to.equal(200);
    pm.expect(t23Update.code, "Cập nhật thành công").to.equal(200);
    pm.expect(t23Delete.code, "Xóa thành công").to.equal(200);
  });

  // Mục tiêu: User thường không thể cập nhật/xóa danh mục. Tham chiếu: API5, FR-12
  const t24Cat = await ctx.call("POST", "/api/categories", { token: ctx.ADMIN, body: { name: "T24-Cat" } });
  let t24UserPut;
  if (t24Cat.code === 200) {
    t24UserPut = await ctx.call("PUT", "/api/categories/" + t24Cat.json.id, { token: ctx.USER, body: { name: "Hack" } });
    await ctx.call("DELETE", "/api/categories/" + t24Cat.json.id, { token: ctx.ADMIN });
  }
  pm.test("T24 User thường bị 403 khi sửa/xóa danh mục", function () {
    pm.expect(t24UserPut.code).to.equal(403);
  });

  // Mục tiêu: Xem giỏ hàng hợp lệ. Tham chiếu: FR-07
  const t25Cart = await ctx.call("GET", "/api/cart", { token: ctx.USER });
  pm.test("T25 Xem giỏ hàng trả về mảng", function () {
    pm.expect(t25Cart.code).to.equal(200);
    pm.expect(t25Cart.json).to.be.an("array");
  });

  // Mục tiêu: Xem danh sách đơn hàng và Admin xem toàn bộ đơn hàng. Tham chiếu: FR-11, FR-18
  const t26UserOrders = await ctx.call("GET", "/api/orders/my-orders", { token: ctx.USER });
  const t26AdminOrders = await ctx.call("GET", "/api/admin/orders", { token: ctx.ADMIN });
  pm.test("T26 API Lấy danh sách đơn hàng hợp lệ", function () {
    pm.expect(t26UserOrders.code, "User xem đơn hàng").to.equal(200);
    pm.expect(t26AdminOrders.code, "Admin xem đơn hàng toàn hệ thống").to.equal(200);
    if (t26AdminOrders.code === 200 && t26AdminOrders.json.length > 0) {
      pm.expect(t26AdminOrders.json[0], "Đơn hàng admin có user_name").to.have.property("user_name");
    }
  });

  // Mục tiêu: User hủy đơn hàng hợp lệ khi pending và Admin cập nhật trạng thái hợp lệ. Tham chiếu: FR-10
  const t27User = await ctx.newUser("t27");
  await ctx.call("POST", "/api/cart", { token: t27User.token, body: { id: 1, name: "Sp", price: 1000, quantity: 1 } });
  const t27Order = await ctx.call("POST", "/api/checkout", { token: t27User.token, body: { total_amount: 1000 } });
  let t27Cancel, t27StatusUpdate;
  if (t27Order.code === 200) {
    const oId = t27Order.json.orderId;
    // Chuyển sang confirmed để test admin update
    t27StatusUpdate = await ctx.call("PUT", "/api/admin/orders/" + oId + "/status", { token: ctx.ADMIN, body: { status: "confirmed" } });
    // User hủy đơn sau khi confirmed (hợp lệ theo FR-10)
    t27Cancel = await ctx.call("PUT", "/api/orders/" + oId + "/cancel", { token: t27User.token });
  }
  pm.test("T27 Admin cập nhật trạng thái và User hủy đơn hợp lệ", function () {
    pm.expect(t27StatusUpdate.code, "Admin cập nhật pending -> confirmed").to.equal(200);
    pm.expect(t27Cancel.code, "User hủy đơn confirmed").to.equal(200);
  });

  // Mục tiêu: Admin CRUD Mã giảm giá, áp dụng và ghi nhận. Tham chiếu: FR-09, FR-17
  const t28Code = "T28-" + ctx.RUN;
  const t28Coupon = await ctx.call("POST", "/api/admin/coupons", { 
    token: ctx.ADMIN, 
    body: { code: t28Code, type: "fixed", discount_value: 10000, min_order_amount: 20000, expired_at: "2099-12-31", max_uses_per_user: 1 } 
  });
  let t28GetList, t28Apply, t28RecordUsage, t28Delete;
  if (t28Coupon.code === 200) {
    const cId = t28Coupon.json.id;
    t28GetList = await ctx.call("GET", "/api/coupons", { token: ctx.ADMIN });
    t28Apply = await ctx.call("POST", "/api/apply-coupon", { body: { code: t28Code, total_amount: 50000 } });
    t28RecordUsage = await ctx.call("POST", "/api/coupon-usage", { token: ctx.USER, body: { coupon_id: cId } });
    t28Delete = await ctx.call("DELETE", "/api/admin/coupons/" + cId, { token: ctx.ADMIN });
  }
  pm.test("T28 Luồng Mã giảm giá hoàn chỉnh (Đường đi đúng)", function () {
    pm.expect(t28Coupon.code, "Admin tạo coupon").to.equal(200);
    pm.expect(t28GetList.code, "Admin lấy ds coupon").to.equal(200);
    pm.expect(t28Apply.code, "Áp dụng coupon hợp lệ").to.equal(200);
    pm.expect(t28RecordUsage.code, "Ghi nhận sử dụng").to.equal(200);
    pm.expect(t28Delete.code, "Admin xóa coupon").to.equal(200);
  });

  // Mục tiêu: Admin xem danh sách user và xóa user thành công. Tham chiếu: API3 (không lộ pass), FR-19
  const t29User = await ctx.newUser("t29");
  const t29GetUsers = await ctx.call("GET", "/api/admin/users", { token: ctx.ADMIN });
  const t29DeleteUser = await ctx.call("DELETE", "/api/admin/users/" + t29User.id, { token: ctx.ADMIN });
  pm.test("T29 Admin xem và xóa User", function () {
    pm.expect(t29GetUsers.code, "Lấy DS user").to.equal(200);
    if (t29GetUsers.json.length > 0) {
      pm.expect(t29GetUsers.json[0], "Không lộ password").to.not.have.property("password");
    }
    pm.expect(t29DeleteUser.code, "Xóa user thành công").to.equal(200);
  });
}

async function aiTests(ctx) {
  await aiTestsPart1(ctx);
  await aiTestsPart2(ctx);
  await aiTestsPart3(ctx);
}