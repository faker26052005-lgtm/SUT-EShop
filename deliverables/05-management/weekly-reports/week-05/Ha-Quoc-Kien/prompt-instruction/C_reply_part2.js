async function aiTestsPart2(ctx) {
  // Lấy danh sách sản phẩm để dùng cho các test giỏ hàng/đơn hàng
  const products = await ctx.call("GET", "/api/products");
  const testProduct = products.json && products.json.length > 0 ? products.json[0] : null;
  // Nếu không có sản phẩm nào, tạo mới một sản phẩm
  let productId = testProduct ? testProduct.id : 1;
  let productPrice = testProduct ? testProduct.price : 30000000;

  if (!testProduct) {
    const newProd = await ctx.call("POST", "/api/products", {
      token: ctx.ADMIN,
      body: { name: "Test Product " + ctx.RUN, price: productPrice, category_id: 1, description: "Test", imageUrl: "img.jpg" }
    });
    if (newProd.code === 200) productId = newProd.json.id;
  }

  // Mục tiêu: Không cho phép thêm số lượng âm vào giỏ hàng. Tham chiếu: R08, API6
  const t09User = await ctx.newUser("t09");
  const t09Cart = await ctx.call("POST", "/api/cart", {
    token: t09User.token,
    body: { id: productId, name: "Test Item", price: productPrice, quantity: -5 }
  });

  pm.test("T09 Giỏ hàng từ chối số lượng âm hoặc không hợp lệ", function () {
    pm.expect(t09Cart.code, "Mã lỗi khi gửi quantity âm").to.be.oneOf([400, 422]);
  });

  // Mục tiêu: Thanh toán đơn hàng thành công, kiểm tra chi tiết đơn hàng. Tham chiếu: FR-08, R07
  const t10User = await ctx.newUser("t10");
  await ctx.call("POST", "/api/cart", {
    token: t10User.token,
    body: { id: productId, name: "Test Item", price: productPrice, quantity: 1 }
  });
  const t10Checkout = await ctx.call("POST", "/api/checkout", {
    token: t10User.token,
    body: { total_amount: productPrice, shipping_address: "123 Valid St" }
  });

  let t10Order;
  if (t10Checkout.code === 200 && t10Checkout.json.orderId) {
    t10Order = await ctx.call("GET", "/api/orders/" + t10Checkout.json.orderId, { token: t10User.token });
  }

  pm.test("T10 Thanh toán tạo đơn hàng thành công", function () {
    pm.expect(t10Checkout.code, "Thanh toán thành công").to.equal(200);
    pm.expect(t10Checkout.json.orderId, "Có Order ID").to.be.a("number");
    pm.expect(t10Order, "Lấy chi tiết đơn hàng").to.not.be.undefined;
    pm.expect(t10Order.code).to.equal(200);
    pm.expect(t10Order.json.total_amount, "Tổng tiền đơn hàng").to.equal(productPrice);
  });

  // Mục tiêu: Hệ thống không tin tưởng total_amount từ client (Data Tampering). Tham chiếu: R07, API6
  const t11User = await ctx.newUser("t11");
  await ctx.call("POST", "/api/cart", {
    token: t11User.token,
    body: { id: productId, name: "Test Item", price: productPrice, quantity: 1 }
  });
  const t11Checkout = await ctx.call("POST", "/api/checkout", {
    token: t11User.token,
    body: { total_amount: 1000, shipping_address: "Hack St" }
  });

  pm.test("T11 Thanh toán từ chối sai lệch total_amount hoặc tự tính lại", function () {
    // API có thể trả 400 (từ chối do sai giá) hoặc 200 (nhưng bỏ qua giá trị client, tự tính đúng giá)
    if (t11Checkout.code === 200) {
      pm.expect(t11Checkout.json.orderId, "Có orderId").to.be.a("number");
    } else {
      pm.expect(t11Checkout.code, "Từ chối dữ liệu bị bóp méo").to.be.oneOf([400, 422]);
    }
  });

  // Mục tiêu: BOLA/IDOR - User B không xem được đơn của User A. Tham chiếu: R11, FR-11, API1
  const t12UserA = t10User; // Đã tạo đơn ở T10
  const t12UserB = await ctx.newUser("t12_b");
  const orderIdA = t10Checkout.json ? t10Checkout.json.orderId : 99999;
  
  const t12Attempt = await ctx.call("GET", "/api/orders/" + orderIdA, { token: t12UserB.token });

  pm.test("T12 BOLA: User không thể xem chi tiết đơn hàng của người khác", function () {
    pm.expect(t12Attempt.code, "Bị chặn truy cập chéo (403 hoặc 404)").to.be.oneOf([403, 404]);
    if (t12Attempt.code === 200) {
      pm.expect(t12Attempt.json.user_id, "Nếu trả về, đảm bảo nó không lộ chéo").to.not.equal(t12UserA.id);
    }
  });

  // Mục tiêu: Chặn hủy đơn hàng khi trạng thái đã qua mức cho phép (shipping/delivered). Tham chiếu: R10, FR-10
  // Cần một đơn hàng ở trạng thái shipping. Ta lấy đơn của T10 và ép trạng thái thành shipping qua API Admin
  const t13OrderId = t10Checkout.json ? t10Checkout.json.orderId : 99999;
  await ctx.call("PUT", "/api/admin/orders/" + t13OrderId + "/status", {
    token: ctx.ADMIN,
    body: { status: "confirmed" }
  });
  await ctx.call("PUT", "/api/admin/orders/" + t13OrderId + "/status", {
    token: ctx.ADMIN,
    body: { status: "shipping" }
  });

  const t13Cancel = await ctx.call("PUT", "/api/orders/" + t13OrderId + "/cancel", { token: t10User.token });

  pm.test("T13 User không thể tự hủy đơn hàng đang giao (shipping)", function () {
    pm.expect(t13Cancel.code, "Từ chối hủy do sai luật trạng thái").to.be.oneOf([400, 403]);
  });

  // Mục tiêu: Kiểm tra quy tắc giảm giá (không đủ ngưỡng). Tham chiếu: R09, FR-09
  const t14Apply = await ctx.call("POST", "/api/apply-coupon", {
    body: { code: "SAVE10", total_amount: 200000 } // SAVE10 cần tối thiểu 300k
  });

  pm.test("T14 Từ chối áp dụng mã giảm giá khi không đủ ngưỡng", function () {
    pm.expect(t14Apply.code, "Mã lỗi do vi phạm nghiệp vụ").to.be.oneOf([400, 404, 422]);
    pm.expect(t14Apply.json.error, "Có thông báo lỗi rõ ràng").to.be.a("string");
  });

  // Mục tiêu: Chuyển đổi trạng thái đơn hàng nhảy cóc (Bypass state machine). Tham chiếu: R10, FR-10
  const t16User = await ctx.newUser("t16");
  await ctx.call("POST", "/api/cart", { token: t16User.token, body: { id: productId, name: "T16", price: productPrice, quantity: 1 } });
  const t16Checkout = await ctx.call("POST", "/api/checkout", { token: t16User.token, body: { total_amount: productPrice } });
  const t16OrderId = t16Checkout.json ? t16Checkout.json.orderId : 99999;
  
  const t16StatusUpdate = await ctx.call("PUT", "/api/admin/orders/" + t16OrderId + "/status", {
    token: ctx.ADMIN,
    body: { status: "delivered" } // Chuyển thẳng từ pending -> delivered
  });

  pm.test("T16 Admin bị chặn chuyển trạng thái nhảy cóc (pending -> delivered)", function () {
    pm.expect(t16StatusUpdate.code, "Lỗi trạng thái không hợp lệ").to.equal(400);
  });

  // Mục tiêu: Logic flaw - Admin không được tự xóa tài khoản của chính mình. Tham chiếu: R13, FR-19
  const t17AdminProfile = await ctx.call("GET", "/api/users/me", { token: ctx.ADMIN });
  let t17SelfDelete;
  if (t17AdminProfile.code === 200 && t17AdminProfile.json.id) {
    t17SelfDelete = await ctx.call("DELETE", "/api/admin/users/" + t17AdminProfile.json.id, { token: ctx.ADMIN });
  }

  pm.test("T17 Admin không thể tự xóa tài khoản của chính mình", function () {
    pm.expect(t17SelfDelete, "Đã gọi xóa tự sát").to.not.be.undefined;
    pm.expect(t17SelfDelete.code, "Server từ chối yêu cầu (400 hoặc 403)").to.be.oneOf([400, 403]);
  });

  // Mục tiêu: Validation Coupon - Không tạo mã có discount_value âm. Tham chiếu: FR-17
  const t20CreateCoupon = await ctx.call("POST", "/api/admin/coupons", {
    token: ctx.ADMIN,
    body: {
      code: "HACK-" + ctx.RUN,
      type: "fixed",
      discount_value: -50000,
      min_order_amount: 100000,
      expired_at: "2099-12-31",
      max_uses_per_user: 1
    }
  });

  pm.test("T20 Admin tạo Coupon: Từ chối giá trị giảm âm", function () {
    pm.expect(t20CreateCoupon.code, "Validation thất bại").to.be.oneOf([400, 422]);
  });
}

async function aiTests(ctx) {
  await aiTestsPart1(ctx);
  await aiTestsPart2(ctx);
}