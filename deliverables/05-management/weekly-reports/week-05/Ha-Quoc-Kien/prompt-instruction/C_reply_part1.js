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