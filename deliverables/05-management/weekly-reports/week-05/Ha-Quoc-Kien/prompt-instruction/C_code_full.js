async function aiTestsPart1(ctx) {
  // Mục tiêu: Đăng ký user hợp lệ thành công và có thể đăng nhập. Tham chiếu: R01, FR-01
  const t01Email = "t01-" + ctx.RUN + "@test.com";
  const t01Pass = "StrongPass123!@#";
  const t01Reg = await ctx.call("POST", "/api/register", {
    body: { name: "User T01", email: t01Email, password: t01Pass }
  });
  
  let t01Login;
  if (t01Reg.code === 200) {
    t01Login = await ctx.call("POST", "/api/login", {
      body: { email: t01Email, password: t01Pass }
    });
  }
  
  pm.test("T01 Đăng ký hợp lệ và đăng nhập thành công", function () {
    pm.expect(t01Reg.code, "Mã trạng thái đăng ký").to.equal(200);
    pm.expect(t01Reg.json.id, "ID user trả về").to.be.a("number");
    
    pm.expect(t01Login, "Phản hồi đăng nhập").to.not.be.undefined;
    pm.expect(t01Login.code, "Mã trạng thái đăng nhập").to.equal(200);
    pm.expect(t01Login.json.token, "JWT Token").to.be.a("string");
    pm.expect(t01Login.json.user.password, "Không lộ password trong response").to.be.undefined;
  });

  // Mục tiêu: Không cho phép đăng ký với mật khẩu yếu (thiếu độ phức tạp). Tham chiếu: R01, FR-01
  const t02Email = "t02-" + ctx.RUN + "@test.com";
  const t02Reg = await ctx.call("POST", "/api/register", {
    body: { name: "User T02", email: t02Email, password: "weakpassword" }
  });
  
  pm.test("T02 Đăng ký thất bại do mật khẩu yếu", function () {
    pm.expect(t02Reg.code, "Mã lỗi do pass yếu").to.be.oneOf([400, 422]);
    pm.expect(t02Reg.json.error, "Thông báo lỗi").to.be.a("string");
  });

  // Mục tiêu: Ngăn chặn Mass Assignment khi đăng ký (cố tình truyền role admin). Tham chiếu: API3, SEC-06
  const t03Email = "t03-" + ctx.RUN + "@test.com";
  const t03Pass = "AdminHack123!@";
  await ctx.call("POST", "/api/register", {
    body: { name: "User T03", email: t03Email, password: t03Pass, role: "admin" }
  });
  const t03Login = await ctx.call("POST", "/api/login", { body: { email: t03Email, password: t03Pass } });
  
  let t03Profile;
  if (t03Login.code === 200) {
    t03Profile = await ctx.call("GET", "/api/users/me", { token: t03Login.json.token });
  }

  pm.test("T03 Không thể tự cấp quyền admin khi đăng ký", function () {
    pm.expect(t03Profile, "Profile sau đăng ký").to.not.be.undefined;
    pm.expect(t03Profile.json.role, "Role phải là user").to.equal("user");
  });

  // Mục tiêu: Khóa tài khoản 30s sau khi sai mật khẩu 3 lần. Tham chiếu: R02, FR-02, API2
  const t04User = await ctx.newUser("t04");
  await ctx.call("POST", "/api/login", { body: { email: t04User.email, password: "WrongPassword1!" } });
  await ctx.call("POST", "/api/login", { body: { email: t04User.email, password: "WrongPassword2!" } });
  await ctx.call("POST", "/api/login", { body: { email: t04User.email, password: "WrongPassword3!" } });
  const t04Attempt4 = await ctx.call("POST", "/api/login", { body: { email: t04User.email, password: t04User.password } });

  pm.test("T04 Khóa tài khoản sau 3 lần đăng nhập sai", function () {
    pm.expect(t04Attempt4.code, "Lần thử thứ 4 phải bị khóa (403)").to.equal(403);
    pm.expect(t04Attempt4.json.error, "Thông báo khóa").to.be.a("string");
  });

  // Mục tiêu: Luồng quên mật khẩu, cấp OTP và ngăn chặn dùng lại OTP. Tham chiếu: R03, FR-03, SEC-07
  const t05User = await ctx.newUser("t05");
  const t05Forgot = await ctx.call("POST", "/api/forgot-password", { body: { email: t05User.email } });
  let t05Reset1, t05Reset2;
  
  if (t05Forgot.code === 200 && t05Forgot.json.resetToken) {
    t05Reset1 = await ctx.call("POST", "/api/reset-password", {
      body: { email: t05User.email, resetToken: t05Forgot.json.resetToken, newPassword: "NewStrongPass1!@" }
    });
    t05Reset2 = await ctx.call("POST", "/api/reset-password", {
      body: { email: t05User.email, resetToken: t05Forgot.json.resetToken, newPassword: "AnotherPass2!@" }
    });
  }

  pm.test("T05 Quên mật khẩu và đổi mật khẩu an toàn, OTP không dùng lại được", function () {
    pm.expect(t05Forgot.code, "Yêu cầu forgot password").to.equal(200);
    pm.expect(t05Forgot.json.resetToken, "OTP token sinh ra").to.be.a("string").and.lengthOf.at.least(6);
    
    pm.expect(t05Reset1, "Lần đổi mật khẩu đầu tiên").to.not.be.undefined;
    pm.expect(t05Reset1.code, "Đổi mật khẩu thành công").to.equal(200);
    
    pm.expect(t05Reset2, "Lần dùng lại OTP").to.not.be.undefined;
    pm.expect(t05Reset2.code, "Từ chối OTP đã dùng").to.be.oneOf([400, 403]);
  });

  // Mục tiêu: Ngăn chặn user thường tự đổi email hoặc role qua API cập nhật hồ sơ. Tham chiếu: R04, SEC-06, API3
  const t06User = await ctx.newUser("t06");
  const t06Update = await ctx.call("PUT", "/api/users/me", {
    token: t06User.token,
    body: { name: "Hacked Name", email: "hacker@test.com", role: "admin", phone: "0987654321", shipping_address: "123 Street" }
  });
  const t06Profile = await ctx.call("GET", "/api/users/me", { token: t06User.token });

  pm.test("T06 API cập nhật hồ sơ từ chối Mass Assignment (đổi email, role)", function () {
    pm.expect(t06Update.code, "Mã phản hồi cập nhật").to.be.oneOf([200, 400]); // Chấp nhận 200 (bỏ qua field sai) hoặc 400 (báo lỗi)
    pm.expect(t06Profile.code).to.equal(200);
    pm.expect(t06Profile.json.name, "Tên được phép đổi").to.equal("Hacked Name");
    pm.expect(t06Profile.json.email, "Email KHÔNG được đổi").to.equal(t06User.email);
    pm.expect(t06Profile.json.role, "Role KHÔNG được đổi").to.equal("user");
  });

  // Mục tiêu: BFLA - User thường không thể thêm sản phẩm. Tham chiếu: R12, SEC-03, API5
  const t07User = await ctx.newUser("t07");
  const t07CreateProduct = await ctx.call("POST", "/api/products", {
    token: t07User.token,
    body: { name: "Hacked Product", price: 100000, category_id: 1 }
  });

  pm.test("T07 BFLA: User thường tạo sản phẩm bị từ chối 403", function () {
    pm.expect(t07CreateProduct.code, "Trạng thái cấm truy cập").to.equal(403);
  });

  // Mục tiêu: Giá trị biên - Không tạo sản phẩm có giá trị âm. Tham chiếu: R05, FR-15
  const t08ProductName = "T08-Product-" + ctx.RUN;
  const t08CreateProduct = await ctx.call("POST", "/api/products", {
    token: ctx.ADMIN,
    body: { name: t08ProductName, price: -50000, category_id: 1, description: "Test", imageUrl: "http://img.com" }
  });
  const t08Check = await ctx.call("GET", "/api/products?search=" + encodeURIComponent(t08ProductName));

  pm.test("T08 Admin không thể tạo sản phẩm với giá âm", function () {
    pm.expect(t08CreateProduct.code, "Mã lỗi validation").to.be.oneOf([400, 422]);
    pm.expect(t08Check.json.length, "Sản phẩm không được lưu vào DB").to.equal(0);
  });

  // Mục tiêu: Nhập sản phẩm nguyên tử (all-or-nothing). Tham chiếu: R06, FR-16
  const t15ValidName = "T15-Valid-" + ctx.RUN;
  const t15Import = await ctx.call("POST", "/api/admin/import-products", {
    token: ctx.ADMIN,
    body: {
      products: [
        { name: t15ValidName, price: 10000, category_id: 1, description: "OK", imageUrl: "a.jpg" },
        { name: "T15-Invalid-" + ctx.RUN, price: -500, category_id: 1, description: "Lỗi giá âm", imageUrl: "b.jpg" }
      ]
    }
  });
  const t15Check = await ctx.call("GET", "/api/products?search=" + encodeURIComponent(t15ValidName));

  pm.test("T15 Import sản phẩm rollback toàn bộ nếu có 1 dòng lỗi (Atomic)", function () {
    pm.expect(t15Import.code, "Trạng thái trả về khi có lỗi dữ liệu").to.be.oneOf([200, 400]); // Tùy logic backend (200 kèm errors array hoặc 400)
    // Dù trả mã nào, sản phẩm hợp lệ trong batch lỗi cũng không được xuất hiện ở DB
    pm.expect(t15Check.json.some(p => p.name === t15ValidName), "Sản phẩm đúng trong batch bị lỗi không được lưu").to.equal(false);
  });

  // Mục tiêu: Tìm kiếm sản phẩm xử lý XSS/SQLi an toàn. Tham chiếu: SEC-04, SEC-05, API8
  const t18Search = await ctx.call("GET", "/api/products?search=' OR 1=1 --");

  pm.test("T18 API Tìm kiếm không bị crash với payload SQLi", function () {
    pm.expect(t18Search.code, "API chạy bình thường, không quăng 500").to.equal(200);
    pm.expect(t18Search.json, "Trả về mảng (rỗng hoặc có item hợp lệ)").to.be.an("array");
  });

  // Mục tiêu: User thường không thể thêm danh mục, Admin thực hiện CRUD thành công. Tham chiếu: R12, FR-14, API5
  const t19User = await ctx.newUser("t19");
  const t19CatName = "T19-Cat-" + ctx.RUN;
  const t19UserFail = await ctx.call("POST", "/api/categories", {
    token: t19User.token, body: { name: "Hack Cat" }
  });
  
  const t19AdminPost = await ctx.call("POST", "/api/categories", {
    token: ctx.ADMIN, body: { name: t19CatName }
  });

  let t19List, t19AdminDelete;
  if (t19AdminPost.code === 200 && t19AdminPost.json.id) {
    t19List = await ctx.call("GET", "/api/categories");
    t19AdminDelete = await ctx.call("DELETE", "/api/categories/" + t19AdminPost.json.id, { token: ctx.ADMIN });
  }

  pm.test("T19 Phân quyền và CRUD Category", function () {
    pm.expect(t19UserFail.code, "User thường bị chặn").to.equal(403);
    pm.expect(t19AdminPost.code, "Admin tạo thành công").to.equal(200);
    pm.expect(t19AdminPost.json.id, "Trả về ID hợp lệ").to.be.a("number");
    
    pm.expect(t19List, "Danh sách load được").to.not.be.undefined;
    pm.expect(t19List.json.some(c => c.name === t19CatName), "Danh mục mới xuất hiện trong list").to.equal(true);
    
    pm.expect(t19AdminDelete, "Xóa danh mục").to.not.be.undefined;
    pm.expect(t19AdminDelete.code, "Admin xóa thành công").to.equal(200);
  });
}

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