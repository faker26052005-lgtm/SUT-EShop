async function aiTests(ctx) {
    const run = ctx.RUN;
    const adminToken = ctx.ADMIN;
    
    // --- AUTH & USERS ---
    const newUser = await ctx.newUser(`user_${run}`);
    
    const loginRes = await ctx.call('post', '/api/login', {
        body: { email: newUser.email, password: newUser.password }
    });
    pm.test("T01 Auth - Login successful", function () {
        pm.expect(loginRes.code).to.equal(200);
        pm.expect(loginRes.json.token).to.be.a('string');
        pm.expect(loginRes.json.user).to.be.an('object');
    });
    
    const forgotRes = await ctx.call('post', '/api/forgot-password', {
        body: { email: newUser.email }
    });
    pm.test("T02 Auth - Forgot password", function () {
        pm.expect(forgotRes.code).to.equal(200);
        pm.expect(forgotRes.json.resetToken).to.exist;
    });
    
    if (forgotRes.code === 200) {
        const resetRes = await ctx.call('post', '/api/reset-password', {
            body: { 
                email: newUser.email, 
                resetToken: forgotRes.json.resetToken, 
                newPassword: 'NewPassword123!' 
            }
        });
        pm.test("T03 Auth - Reset password", function () {
            pm.expect(resetRes.code).to.equal(200);
        });
    }

    const profileRes = await ctx.call('get', '/api/users/me', { token: newUser.token });
    pm.test("T04 Users - Get profile", function () {
        pm.expect(profileRes.code).to.equal(200);
        pm.expect(profileRes.json.email).to.equal(newUser.email);
    });

    const updateProfileRes = await ctx.call('put', '/api/users/me', {
        token: newUser.token,
        body: { name: `Updated Name ${run}`, phone: "0123456789", shipping_address: "123 Test St" }
    });
    pm.test("T05 Users - Update profile", function () {
        pm.expect(updateProfileRes.code).to.equal(200);
    });

    // --- CATEGORIES ---
    const catPostRes = await ctx.call('post', '/api/categories', {
        token: adminToken,
        body: { name: `Category ${run}` }
    });
    pm.test("T06 Admin - Create category", function () {
        pm.expect(catPostRes.code).to.equal(200);
        pm.expect(catPostRes.json.id).to.be.a('number');
    });
    const categoryId = catPostRes.json?.id;

    const catGetRes = await ctx.call('get', '/api/categories');
    pm.test("T07 Categories - Get all", function () {
        pm.expect(catGetRes.code).to.equal(200);
        pm.expect(Array.isArray(catGetRes.json)).to.be.true;
    });

    const catPutRes = await ctx.call('put', `/api/categories/${categoryId}`, {
        token: adminToken,
        body: { name: `Category Updated ${run}` }
    });
    pm.test("T08 Admin - Update category", function () {
        pm.expect(catPutRes.code).to.equal(200);
    });

    // --- PRODUCTS ---
    const prodPostRes = await ctx.call('post', '/api/products', {
        token: adminToken,
        body: { 
            name: `Product ${run}`, 
            price: 150000, 
            description: "A great product", 
            imageUrl: "http://example.com/img.jpg", 
            category_id: categoryId 
        }
    });
    pm.test("T09 Admin - Create product", function () {
        pm.expect(prodPostRes.code).to.equal(200);
        pm.expect(prodPostRes.json.id).to.be.a('number');
    });
    const productId = prodPostRes.json?.id;

    const prodGetRes = await ctx.call('get', '/api/products');
    pm.test("T10 Products - Get all", function () {
        pm.expect(prodGetRes.code).to.equal(200);
        pm.expect(Array.isArray(prodGetRes.json)).to.be.true;
    });

    const prodGetOneRes = await ctx.call('get', `/api/products/${productId}`);
    pm.test("T11 Products - Get one by ID", function () {
        pm.expect(prodGetOneRes.code).to.equal(200);
        pm.expect(prodGetOneRes.json.id).to.equal(productId);
    });

    const prodPutRes = await ctx.call('put', `/api/products/${productId}`, {
        token: adminToken,
        body: { 
            name: `Product Updated ${run}`, 
            price: 160000, 
            description: "Updated desc", 
            imageUrl: "http://example.com/img2.jpg", 
            category_id: categoryId 
        }
    });
    pm.test("T12 Admin - Update product", function () {
        pm.expect(prodPutRes.code).to.equal(200);
    });

    // --- CART ---
    const cartPostRes = await ctx.call('post', '/api/cart', {
        token: newUser.token,
        body: { id: productId, name: `Product Updated ${run}`, price: 160000, quantity: 2 }
    });
    pm.test("T13 Cart - Add item", function () {
        pm.expect(cartPostRes.code).to.equal(200);
    });

    const cartGetRes = await ctx.call('get', '/api/cart', { token: newUser.token });
    pm.test("T14 Cart - Get items", function () {
        pm.expect(cartGetRes.code).to.equal(200);
        pm.expect(Array.isArray(cartGetRes.json)).to.be.true;
    });

    // --- COUPONS ---
    const couponCode = `DISC_${run}`;
    const couponPostRes = await ctx.call('post', '/api/admin/coupons', {
        token: adminToken,
        body: { 
            code: couponCode, 
            type: "percent", 
            discount_value: 10, 
            min_order_amount: 100000, 
            expired_at: "2030-12-31", 
            max_uses_per_user: 1 
        }
    });
    pm.test("T15 Admin - Create coupon", function () {
        pm.expect(couponPostRes.code).to.equal(200);
    });
    const couponId = couponPostRes.json?.id;

    const adminCouponsGetRes = await ctx.call('get', '/api/coupons', { token: adminToken });
    pm.test("T16 Admin - Get coupons list", function () {
        pm.expect(adminCouponsGetRes.code).to.equal(200);
    });

    const couponApplyRes = await ctx.call('post', '/api/apply-coupon', {
        body: { code: couponCode, total_amount: 320000 }
    });
    pm.test("T17 Coupons - Apply valid coupon", function () {
        pm.expect(couponApplyRes.code).to.equal(200);
        pm.expect(couponApplyRes.json.success).to.be.true;
    });

    // --- ORDERS ---
    const checkoutRes = await ctx.call('post', '/api/checkout', {
        token: newUser.token,
        body: { total_amount: 320000, shipping_address: "123 Test St", coupon_id: couponId }
    });
    pm.test("T18 Orders - Checkout", function () {
        pm.expect(checkoutRes.code).to.equal(200);
        pm.expect(checkoutRes.json.orderId).to.be.a('number');
    });
    const orderId = checkoutRes.json?.orderId;

    const couponUsageRes = await ctx.call('post', '/api/coupon-usage', {
        token: newUser.token,
        body: { coupon_id: couponId }
    });
    pm.test("T19 Coupons - Record usage", function () {
        pm.expect(couponUsageRes.code).to.equal(200);
    });

    const myOrdersRes = await ctx.call('get', '/api/orders/my-orders', { token: newUser.token });
    pm.test("T20 Orders - Get my orders", function () {
        pm.expect(myOrdersRes.code).to.equal(200);
        pm.expect(Array.isArray(myOrdersRes.json)).to.be.true;
    });

    const getOrderRes = await ctx.call('get', `/api/orders/${orderId}`, { token: newUser.token });
    pm.test("T21 Orders - Get order detail", function () {
        pm.expect(getOrderRes.code).to.equal(200);
        pm.expect(getOrderRes.json.id).to.equal(orderId);
    });

    const updateStatusRes = await ctx.call('put', `/api/admin/orders/${orderId}/status`, {
        token: adminToken,
        body: { status: "confirmed" }
    });
    pm.test("T22 Admin - Update order status", function () {
        pm.expect(updateStatusRes.code).to.equal(200);
    });

    const adminOrdersRes = await ctx.call('get', '/api/admin/orders', { token: adminToken });
    pm.test("T23 Admin - Get all orders", function () {
        pm.expect(adminOrdersRes.code).to.equal(200);
        pm.expect(Array.isArray(adminOrdersRes.json)).to.be.true;
    });

    const newOrderForCancel = await ctx.call('post', '/api/checkout', {
        token: newUser.token,
        body: { total_amount: 100000, shipping_address: "Will Cancel St" }
    });
    const cancelOrderId = newOrderForCancel.json?.orderId;
    
    if (cancelOrderId) {
        const cancelRes = await ctx.call('put', `/api/orders/${cancelOrderId}/cancel`, { token: newUser.token });
        pm.test("T24 Orders - Cancel pending order", function () {
            pm.expect(cancelRes.code).to.equal(200);
        });
    }

    // --- CLEANUP & DELETIONS ---
    const delProductRes = await ctx.call('delete', `/api/products/${productId}`, { token: adminToken });
    pm.test("T25 Admin - Delete product", function () {
        pm.expect(delProductRes.code).to.equal(200);
    });

    const delCategoryRes = await ctx.call('delete', `/api/categories/${categoryId}`, { token: adminToken });
    pm.test("T26 Admin - Delete category", function () {
        pm.expect(delCategoryRes.code).to.equal(200);
    });

    const delCouponRes = await ctx.call('delete', `/api/admin/coupons/${couponId}`, { token: adminToken });
    pm.test("T27 Admin - Delete coupon", function () {
        pm.expect(delCouponRes.code).to.equal(200);
    });

    const adminUsersRes = await ctx.call('get', '/api/admin/users', { token: adminToken });
    pm.test("T28 Admin - Get all users", function () {
        pm.expect(adminUsersRes.code).to.equal(200);
        pm.expect(Array.isArray(adminUsersRes.json)).to.be.true;
    });

    const delUserRes = await ctx.call('delete', `/api/admin/users/${newUser.id}`, { token: adminToken });
    pm.test("T29 Admin - Delete user", function () {
        pm.expect(delUserRes.code).to.equal(200);
    });
}