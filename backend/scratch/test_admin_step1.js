const http = require('http');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const prisma = require('../src/config/db');
const app = require('../src/app');

const JWT_SECRET = process.env.JWT_SECRET || 'aatmanirbhar_nari_jwt_secret_key_2026';

const getDbCounts = async () => {
  const [
    users,
    businesses,
    services,
    inquiries,
    orders,
    orderItems,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.business.count(),
    prisma.service.count(),
    prisma.inquiry.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
  ]);

  return { users, businesses, services, inquiries, orders, orderItems };
};

const makeRequest = (server, method, path, headers = {}, body = null) => {
  const port = server.address().port;
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
};

const runTest = async () => {
  console.log('=== ADMIN BACKEND STEP 1 VERIFICATION TEST ===\n');

  // Step A: Record initial database counts
  const countsBefore = await getDbCounts();
  console.log('Initial Database Counts:', countsBefore);

  let server;
  let adminUser, customerUser, entrepreneurUser;
  let testBusiness, testService, testInquiry, testOrder;
  const createdUserIds = [];
  const createdBusinessIds = [];
  const createdServiceIds = [];
  const createdInquiryIds = [];
  const createdOrderIds = [];

  try {
    // Start HTTP server on dynamic port
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => resolve());
    });

    // Step B: Create temporary test entities
    const passwordHash = await argon2.hash('TestPassword123!');
    const timestamp = Date.now();

    adminUser = await prisma.user.create({
      data: {
        name: 'Step1 Admin',
        email: `step1_admin_${timestamp}@test.com`,
        phone: '1111111111',
        passwordHash,
        role: 'ADMIN',
      },
    });
    createdUserIds.push(adminUser.id);

    customerUser = await prisma.user.create({
      data: {
        name: 'Step1 Customer',
        email: `step1_customer_${timestamp}@test.com`,
        phone: '2222222222',
        passwordHash,
        role: 'CUSTOMER',
      },
    });
    createdUserIds.push(customerUser.id);

    entrepreneurUser = await prisma.user.create({
      data: {
        name: 'Step1 Entrepreneur',
        email: `step1_entrepreneur_${timestamp}@test.com`,
        phone: '3333333333',
        passwordHash,
        role: 'ENTREPRENEUR',
      },
    });
    createdUserIds.push(entrepreneurUser.id);

    testBusiness = await prisma.business.create({
      data: {
        businessName: 'Step1 Test Business',
        category: 'Handicrafts',
        description: 'Temporary business for testing admin step 1',
        ownerName: entrepreneurUser.name,
        ownerId: entrepreneurUser.id,
        experienceLevel: '5 years',
        location: 'Jaipur',
        serviceArea: 'Rajasthan',
        pricingRange: '500-2000',
      },
    });
    createdBusinessIds.push(testBusiness.id);

    testService = await prisma.service.create({
      data: {
        businessId: testBusiness.id,
        name: 'Step1 Test Service',
        description: 'Temporary service description',
        price: '1000',
        availability: 'Weekdays',
      },
    });
    createdServiceIds.push(testService.id);

    testInquiry = await prisma.inquiry.create({
      data: {
        businessId: testBusiness.id,
        serviceId: testService.id,
        customerId: customerUser.id,
        customerName: customerUser.name,
        customerEmail: customerUser.email,
        customerPhone: customerUser.phone,
        message: 'Test admin inquiry message',
        status: 'PENDING',
      },
    });
    createdInquiryIds.push(testInquiry.id);

    testOrder = await prisma.order.create({
      data: {
        customerId: customerUser.id,
        businessId: testBusiness.id,
        status: 'PENDING',
        totalAmount: 1000.0,
        customerName: customerUser.name,
        customerPhone: customerUser.phone,
        deliveryAddress: '123 Test St',
        items: {
          create: [
            {
              serviceId: testService.id,
              quantity: 1,
              unitPrice: 1000.0,
              subtotal: 1000.0,
            },
          ],
        },
      },
    });
    createdOrderIds.push(testOrder.id);

    const countsWithTest = await getDbCounts();
    console.log('Counts with Temporary Data:', countsWithTest);

    // Tokens
    const adminToken = jwt.sign({ id: adminUser.id, role: adminUser.role }, JWT_SECRET, { expiresIn: '1h' });
    const customerToken = jwt.sign({ id: customerUser.id, role: customerUser.role }, JWT_SECRET, { expiresIn: '1h' });
    const entrepreneurToken = jwt.sign({ id: entrepreneurUser.id, role: entrepreneurUser.role }, JWT_SECRET, { expiresIn: '1h' });

    const adminCookie = { Cookie: `auth_token=${adminToken}` };
    const customerCookie = { Cookie: `auth_token=${customerToken}` };
    const entrepreneurCookie = { Cookie: `auth_token=${entrepreneurToken}` };

    let testIndex = 0;
    const testResults = [];

    const recordResult = (title, passed, detail) => {
      testIndex++;
      testResults.push({ index: testIndex, title, passed, detail });
      console.log(`[${passed ? 'PASS' : 'FAIL'}] Test ${testIndex}: ${title} ${detail ? `(${detail})` : ''}`);
    };

    // 1. Admin can access /api/admin/stats
    const resStats = await makeRequest(server, 'GET', '/api/admin/stats', adminCookie);
    const passStats = resStats.status === 200 && resStats.body?.success === true && typeof resStats.body?.data?.totalUsers === 'number';
    recordResult('Admin access /api/admin/stats', passStats, `Status: ${resStats.status}`);

    // 2. Admin can access /api/admin/users
    const resUsers = await makeRequest(server, 'GET', '/api/admin/users?role=CUSTOMER', adminCookie);
    const passUsers = resUsers.status === 200 && resUsers.body?.success === true && Array.isArray(resUsers.body?.data);
    recordResult('Admin access /api/admin/users', passUsers, `Status: ${resUsers.status}, Found: ${resUsers.body?.data?.length}`);

    // 3. Admin can access /api/admin/businesses
    const resBusinesses = await makeRequest(server, 'GET', '/api/admin/businesses', adminCookie);
    const passBusinesses = resBusinesses.status === 200 && resBusinesses.body?.success === true && Array.isArray(resBusinesses.body?.data);
    recordResult('Admin access /api/admin/businesses', passBusinesses, `Status: ${resBusinesses.status}, Found: ${resBusinesses.body?.data?.length}`);

    // 4. Admin can access /api/admin/orders
    const resOrders = await makeRequest(server, 'GET', '/api/admin/orders?status=PENDING', adminCookie);
    const passOrders = resOrders.status === 200 && resOrders.body?.success === true && Array.isArray(resOrders.body?.data);
    recordResult('Admin access /api/admin/orders', passOrders, `Status: ${resOrders.status}, Found: ${resOrders.body?.data?.length}`);

    // 5. Admin can access /api/admin/inquiries
    const resInquiries = await makeRequest(server, 'GET', '/api/admin/inquiries?status=PENDING', adminCookie);
    const passInquiries = resInquiries.status === 200 && resInquiries.body?.success === true && Array.isArray(resInquiries.body?.data);
    recordResult('Admin access /api/admin/inquiries', passInquiries, `Status: ${resInquiries.status}, Found: ${resInquiries.body?.data?.length}`);

    // 6. CUSTOMER receives 403
    const resCustAuth = await makeRequest(server, 'GET', '/api/admin/stats', customerCookie);
    recordResult('CUSTOMER receives 403', resCustAuth.status === 403, `Status: ${resCustAuth.status}`);

    // 7. ENTREPRENEUR receives 403
    const resEntAuth = await makeRequest(server, 'GET', '/api/admin/stats', entrepreneurCookie);
    recordResult('ENTREPRENEUR receives 403', resEntAuth.status === 403, `Status: ${resEntAuth.status}`);

    // 8. Unauthenticated request receives 401
    const resUnauth = await makeRequest(server, 'GET', '/api/admin/stats');
    recordResult('Unauthenticated receives 401', resUnauth.status === 401, `Status: ${resUnauth.status}`);

    // 9. Sensitive user fields are not returned
    const resAllUsers = await makeRequest(server, 'GET', '/api/admin/users', adminCookie);
    const usersList = resAllUsers.body?.data || [];
    const hasSensitiveData = usersList.some(
      (u) => u.passwordHash !== undefined || u.password !== undefined || u.token !== undefined
    );
    recordResult('Sensitive user fields omitted', !hasSensitiveData && usersList.length > 0, `Checked ${usersList.length} users`);

    // 10. Existing public business APIs still work
    const resPublicBiz = await makeRequest(server, 'GET', '/api/businesses');
    recordResult('Existing public business API works', resPublicBiz.status === 200 && resPublicBiz.body?.success === true, `Status: ${resPublicBiz.status}`);

    // 11. Existing customer order APIs still work
    const resCustOrders = await makeRequest(server, 'GET', '/api/orders', customerCookie);
    recordResult('Existing customer order API works', resCustOrders.status === 200 && resCustOrders.body?.success === true, `Status: ${resCustOrders.status}`);

    // 12. Existing entrepreneur order APIs still work
    const resEntOrders = await makeRequest(server, 'GET', '/api/entrepreneur/orders', entrepreneurCookie);
    recordResult('Existing entrepreneur order API works', resEntOrders.status === 200 && resEntOrders.body?.success === true, `Status: ${resEntOrders.status}`);

    // 13. Existing inquiry APIs still work
    const resEntInq = await makeRequest(server, 'GET', '/api/entrepreneur/inquiries', entrepreneurCookie);
    recordResult('Existing inquiry API works', resEntInq.status === 200 && resEntInq.body?.success === true, `Status: ${resEntInq.status}`);

    // 14. Existing authentication still works
    const resAuthLogin = await makeRequest(server, 'POST', '/api/auth/login', {}, {
      email: adminUser.email,
      password: 'TestPassword123!',
    });
    recordResult('Existing authentication works', resAuthLogin.status === 200 && resAuthLogin.body?.success === true, `Status: ${resAuthLogin.status}`);

    const failedTests = testResults.filter((r) => !r.passed);
    if (failedTests.length > 0) {
      console.error('\nFAILED TESTS SUMMARY:', failedTests);
      process.exitCode = 1;
    } else {
      console.log('\nALL 14 VERIFICATION TESTS PASSED SUCCESSFULLY!');
    }
  } catch (err) {
    console.error('Error during test execution:', err);
    process.exitCode = 1;
  } finally {
    console.log('\nCleaning up temporary test records...');

    if (createdOrderIds.length > 0) {
      await prisma.orderItem.deleteMany({ where: { orderId: { in: createdOrderIds } } });
      await prisma.order.deleteMany({ where: { id: { in: createdOrderIds } } });
    }

    if (createdInquiryIds.length > 0) {
      await prisma.inquiry.deleteMany({ where: { id: { in: createdInquiryIds } } });
    }

    if (createdServiceIds.length > 0) {
      await prisma.service.deleteMany({ where: { id: { in: createdServiceIds } } });
    }

    if (createdBusinessIds.length > 0) {
      await prisma.business.deleteMany({ where: { id: { in: createdBusinessIds } } });
    }

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }

    if (server) {
      server.close();
    }

    const countsAfter = await getDbCounts();
    console.log('Final Database Counts After Cleanup:', countsAfter);

    const countsMatch = JSON.stringify(countsBefore) === JSON.stringify(countsAfter);
    console.log(`Database counts net change equal to 0: ${countsMatch ? 'YES (PASSED)' : 'NO (FAILED)'}`);

    if (!countsMatch) {
      process.exitCode = 1;
    }

    await prisma.$disconnect();
  }
};

runTest();
