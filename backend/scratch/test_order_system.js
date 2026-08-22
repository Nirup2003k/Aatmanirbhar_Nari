const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../src/config/db');
const app = require('../src/app');

const JWT_SECRET = process.env.JWT_SECRET || 'aatmanirbhar_nari_jwt_secret_key_2026';

let server;
const PORT = 4099;
const BASE_URL = `http://localhost:${PORT}`;

const makeToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

const getCookieHeader = (token) => {
  return `auth_token=${token}`;
};

async function runTests() {
  console.log('--- STARTING BACKEND ORDER SYSTEM VERIFICATION TESTS ---');

  // 0. Start Server
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });
  console.log(`Test server running on port ${PORT}`);

  // Count DB records BEFORE
  const initialCounts = {
    users: await prisma.user.count(),
    businesses: await prisma.business.count(),
    services: await prisma.service.count(),
    inquiries: await prisma.inquiry.count(),
    orders: await prisma.order.count(),
    orderItems: await prisma.orderItem.count(),
  };

  console.log('\n--- DATABASE COUNTS BEFORE TESTING ---');
  console.table(initialCounts);

  const testResults = [];
  const logTest = (num, name, passed, details = '') => {
    testResults.push({ test: `Test ${num}: ${name}`, status: passed ? 'PASSED' : 'FAILED', details });
    console.log(`[Test ${num}] ${passed ? '✓ PASSED' : '✗ FAILED'}: ${name} ${details ? `(${details})` : ''}`);
  };

  // Helper variables for test records
  let customer1User, customer2User, entrepreneur1User, entrepreneur2User;
  let business1, business2, service1, service2, serviceForBiz2;

  try {
    const randomSuffix = Date.now();
    customer1User = await prisma.user.create({
      data: {
        name: 'Test Customer 1',
        email: `cust1_${randomSuffix}@test.com`,
        phone: '9876500001',
        passwordHash: 'dummyhash',
        role: 'CUSTOMER',
      },
    });

    customer2User = await prisma.user.create({
      data: {
        name: 'Test Customer 2',
        email: `cust2_${randomSuffix}@test.com`,
        phone: '9876500002',
        passwordHash: 'dummyhash',
        role: 'CUSTOMER',
      },
    });

    entrepreneur1User = await prisma.user.create({
      data: {
        name: 'Test Entrepreneur 1',
        email: `ent1_${randomSuffix}@test.com`,
        phone: '9876500003',
        passwordHash: 'dummyhash',
        role: 'ENTREPRENEUR',
      },
    });

    entrepreneur2User = await prisma.user.create({
      data: {
        name: 'Test Entrepreneur 2',
        email: `ent2_${randomSuffix}@test.com`,
        phone: '9876500004',
        passwordHash: 'dummyhash',
        role: 'ENTREPRENEUR',
      },
    });

    business1 = await prisma.business.create({
      data: {
        businessName: `Test Kitchen ${randomSuffix}`,
        category: 'Food',
        description: 'Test Kitchen Description',
        ownerName: entrepreneur1User.name,
        ownerId: entrepreneur1User.id,
        experienceLevel: '5 years',
        location: 'Hubli',
        serviceArea: 'Hubli',
        pricingRange: '100-200',
        services: {
          create: [
            { name: 'Veg Meal Tiffin', description: 'Tasty meal', price: '₹150 per meal', availability: 'Daily' },
            { name: 'Special Dessert', description: 'Sweet dish', price: '₹50 per portion', availability: 'Daily' },
          ],
        },
      },
      include: { services: true },
    });

    service1 = business1.services[0];
    service2 = business1.services[1];

    business2 = await prisma.business.create({
      data: {
        businessName: `Test Boutique ${randomSuffix}`,
        category: 'Tailoring',
        description: 'Test Boutique Description',
        ownerName: entrepreneur2User.name,
        ownerId: entrepreneur2User.id,
        experienceLevel: '8 years',
        location: 'Dharwad',
        serviceArea: 'Dharwad',
        pricingRange: '300-500',
        services: {
          create: [
            { name: 'Blouse Stitching', description: 'Custom stitching', price: '₹400', availability: '3 days' },
          ],
        },
      },
      include: { services: true },
    });

    serviceForBiz2 = business2.services[0];

    const tokenCust1 = makeToken(customer1User);
    const tokenCust2 = makeToken(customer2User);
    const tokenEnt1 = makeToken(entrepreneur1User);
    const tokenEnt2 = makeToken(entrepreneur2User);

    let createdOrder1Id, createdOrder2Id;

    // --- TEST 1: CUSTOMER can create an order ---
    {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: getCookieHeader(tokenCust1) },
        body: JSON.stringify({
          businessId: business1.id,
          deliveryAddress: '123 Main Street, Hubli',
          items: [
            { serviceId: service1.id, quantity: 2 },
            { serviceId: service2.id, quantity: 1 },
          ],
        }),
      });
      const data = await res.json();
      const passed = res.status === 201 && data.success && data.data.items.length === 2 && Number(data.data.totalAmount) === 350;
      if (passed) createdOrder1Id = data.data.id;
      logTest(1, 'CUSTOMER can create an order', passed, `Status: ${res.status}, OrderId: ${data.data?.id}, Total: ${data.data?.totalAmount}`);
    }

    // --- TEST 2: CUSTOMER can create a second order while the first is still PENDING ---
    {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: getCookieHeader(tokenCust1) },
        body: JSON.stringify({
          businessId: business1.id,
          deliveryAddress: '456 Side Street, Hubli',
          items: [{ serviceId: service1.id, quantity: 1 }],
        }),
      });
      const data = await res.json();
      const passed = res.status === 201 && data.success && data.data.status === 'PENDING';
      if (passed) createdOrder2Id = data.data.id;
      logTest(2, 'CUSTOMER can create second order while first is PENDING', passed, `OrderId: ${data.data?.id}`);
    }

    // --- TEST 3: Customer receives two independent orders ---
    {
      const passed = Boolean(createdOrder1Id && createdOrder2Id && createdOrder1Id !== createdOrder2Id);
      logTest(3, 'Customer receives two independent orders', passed, `Order 1 ID: ${createdOrder1Id}, Order 2 ID: ${createdOrder2Id}`);
    }

    // --- TEST 4 & 5: customerId is taken from req.user.id; Fake customerId is ignored/rejected ---
    {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: getCookieHeader(tokenCust1) },
        body: JSON.stringify({
          customerId: 999999, // Fake customerId attempt
          businessId: business1.id,
          deliveryAddress: '789 Test Lane',
          items: [{ serviceId: service1.id, quantity: 1 }],
        }),
      });
      const data = await res.json();
      const passed = res.status === 201 && data.data.customerId === customer1User.id && data.data.customerId !== 999999;
      logTest(4, 'customerId is taken from req.user.id', passed, `Assigned customerId: ${data.data?.customerId}`);
      logTest(5, 'Fake customerId is ignored/rejected', passed, `Submitted 999999, derived: ${data.data?.customerId}`);
    }

    // --- TEST 6: Fake price/totalAmount cannot manipulate stored total ---
    {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: getCookieHeader(tokenCust1) },
        body: JSON.stringify({
          businessId: business1.id,
          deliveryAddress: 'Fake Price House',
          totalAmount: 1.00, // Attempt price manipulation
          items: [{ serviceId: service1.id, quantity: 2, unitPrice: 0.50, subtotal: 1.00 }],
        }),
      });
      const data = await res.json();
      const expectedTotal = 150 * 2; // 300
      const actualTotal = Number(data.data?.totalAmount);
      const passed = res.status === 201 && actualTotal === expectedTotal;
      logTest(6, 'Fake price/totalAmount cannot manipulate stored total', passed, `Attempted 1.00, Computed actual total: ${actualTotal}`);
    }

    // --- TEST 7: Service belonging to another business is rejected ---
    {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: getCookieHeader(tokenCust1) },
        body: JSON.stringify({
          businessId: business1.id, // Ordering from Business 1
          deliveryAddress: 'Cross Business Street',
          items: [{ serviceId: serviceForBiz2.id, quantity: 1 }], // Service belongs to Business 2!
        }),
      });
      const data = await res.json();
      const passed = res.status === 400 && data.success === false;
      logTest(7, 'Service belonging to another business is rejected', passed, `Status: ${res.status}, Error: "${data.message}"`);
    }

    // --- TEST 8: Entrepreneur can see orders for their own business ---
    {
      const res = await fetch(`${BASE_URL}/api/entrepreneur/orders`, {
        method: 'GET',
        headers: { Cookie: getCookieHeader(tokenEnt1) },
      });
      const data = await res.json();
      const passed = res.status === 200 && data.success && Array.isArray(data.data) && data.data.length >= 2;
      logTest(8, 'Entrepreneur can see orders for their own business', passed, `Count: ${data.count}`);
    }

    // --- TEST 9: Entrepreneur cannot see another entrepreneur's order ---
    {
      const res = await fetch(`${BASE_URL}/api/entrepreneur/orders/${createdOrder1Id}`, {
        method: 'GET',
        headers: { Cookie: getCookieHeader(tokenEnt2) }, // Entrepreneur 2 attempting to view Entrepreneur 1's order
      });
      const data = await res.json();
      const passed = res.status === 403 && data.success === false;
      logTest(9, "Entrepreneur cannot see another entrepreneur's order", passed, `Status: ${res.status}, Message: "${data.message}"`);
    }

    // --- TEST 10: Entrepreneur can update valid order statuses ---
    {
      // Transition createdOrder1Id: PENDING -> ACCEPTED -> PREPARING -> READY -> COMPLETED
      const transitions = ['ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
      let allValidPassed = true;
      let lastStatus = 'PENDING';

      for (const nextStatus of transitions) {
        const res = await fetch(`${BASE_URL}/api/entrepreneur/orders/${createdOrder1Id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: getCookieHeader(tokenEnt1) },
          body: JSON.stringify({ status: nextStatus }),
        });
        const data = await res.json();
        if (res.status !== 200 || !data.success || data.data.status !== nextStatus) {
          allValidPassed = false;
          console.log(`Failed transition ${lastStatus} -> ${nextStatus}:`, data);
          break;
        }
        lastStatus = nextStatus;
      }
      logTest(10, 'Entrepreneur can update valid order statuses', allValidPassed, 'PENDING -> ACCEPTED -> PREPARING -> READY -> COMPLETED');
    }

    // --- TEST 11: Invalid status transitions are rejected ---
    {
      // createdOrder1Id is now COMPLETED (terminal state). Attempt COMPLETED -> PENDING or COMPLETED -> PREPARING
      const res = await fetch(`${BASE_URL}/api/entrepreneur/orders/${createdOrder1Id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: getCookieHeader(tokenEnt1) },
        body: JSON.stringify({ status: 'PENDING' }),
      });
      const data = await res.json();
      const passed = res.status === 400 && data.success === false;
      logTest(11, 'Invalid status transitions are rejected', passed, `Status: ${res.status}, Message: "${data.message}"`);
    }

    // --- TEST 12: Customer can view only their own orders ---
    {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'GET',
        headers: { Cookie: getCookieHeader(tokenCust1) },
      });
      const data = await res.json();
      const allBelongToCust1 = data.data.every((o) => o.customerId === customer1User.id);
      const passed = res.status === 200 && data.success && data.data.length >= 2 && allBelongToCust1;
      logTest(12, 'Customer can view only their own orders', passed, `Found ${data.count} orders for Cust 1`);
    }

    // --- TEST 13: Customer cannot view another customer's order ---
    {
      const res = await fetch(`${BASE_URL}/api/orders/${createdOrder1Id}`, {
        method: 'GET',
        headers: { Cookie: getCookieHeader(tokenCust2) }, // Cust 2 trying to view Cust 1's order
      });
      const data = await res.json();
      const passed = res.status === 403 && data.success === false;
      logTest(13, "Customer cannot view another customer's order", passed, `Status: ${res.status}, Message: "${data.message}"`);
    }

    // --- TEST 14: Customer cancellation rules work ---
    {
      // createdOrder2Id is PENDING -> Cust 1 cancels it -> Should succeed (200)
      const resCancelPending = await fetch(`${BASE_URL}/api/orders/${createdOrder2Id}/cancel`, {
        method: 'PATCH',
        headers: { Cookie: getCookieHeader(tokenCust1) },
      });
      const dataCancelPending = await resCancelPending.json();
      const cancelPendingPassed = resCancelPending.status === 200 && dataCancelPending.data.status === 'CANCELLED';

      // createdOrder1Id is COMPLETED -> Cust 1 attempts cancel -> Should fail (400)
      const resCancelCompleted = await fetch(`${BASE_URL}/api/orders/${createdOrder1Id}/cancel`, {
        method: 'PATCH',
        headers: { Cookie: getCookieHeader(tokenCust1) },
      });
      const dataCancelCompleted = await resCancelCompleted.json();
      const cancelCompletedPassed = resCancelCompleted.status === 400 && dataCancelCompleted.success === false;

      const passed = cancelPendingPassed && cancelCompletedPassed;
      logTest(14, 'Customer cancellation rules work', passed, `PENDING cancel: ${cancelPendingPassed ? 'OK' : 'FAIL'}, COMPLETED cancel rejection: ${cancelCompletedPassed ? 'OK' : 'FAIL'}`);
    }

    // --- TEST 15: Existing public business APIs still work ---
    {
      const res = await fetch(`${BASE_URL}/api/businesses`);
      const data = await res.json();
      const passed = res.status === 200 && data.success && Array.isArray(data.data);
      logTest(15, 'Existing public business APIs still work', passed, `Returned ${data.data?.length} businesses`);
    }

    // --- TEST 16: Existing Inquiry APIs still work ---
    {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: getCookieHeader(tokenCust1) },
        body: JSON.stringify({
          businessId: business1.id,
          serviceId: service1.id,
          customerName: customer1User.name,
          customerEmail: customer1User.email,
          customerPhone: customer1User.phone,
          message: 'Test inquiry message',
        }),
      });
      const data = await res.json();
      const passed = res.status === 201 && data.success && data.data.message === 'Test inquiry message';
      logTest(16, 'Existing Inquiry APIs still work', passed, `Inquiry ID: ${data.data?.id}`);
    }

    // --- TEST 17: Existing authentication still works ---
    {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: { Cookie: getCookieHeader(tokenCust1) },
      });
      const data = await res.json();
      const passed = res.status === 200 && data.success && data.data.id === customer1User.id;
      logTest(17, 'Existing authentication still works', passed, `Authenticated User: ${data.data?.email}`);
    }
  } catch (err) {
    console.error('ERROR DURING TEST RUN:', err);
  } finally {
    // CLEANUP TEMPORARY TEST DATA
    console.log('\n--- CLEANING UP TEMPORARY TEST DATA ---');
    try {
      if (business1 || business2) {
        const testBizIds = [business1?.id, business2?.id].filter(Boolean);
        await prisma.orderItem.deleteMany({
          where: { order: { businessId: { in: testBizIds } } },
        });
        await prisma.order.deleteMany({
          where: { businessId: { in: testBizIds } },
        });
        await prisma.inquiry.deleteMany({
          where: { businessId: { in: testBizIds } },
        });
        await prisma.service.deleteMany({
          where: { businessId: { in: testBizIds } },
        });
        await prisma.business.deleteMany({
          where: { id: { in: testBizIds } },
        });
      }

      if (customer1User || customer2User || entrepreneur1User || entrepreneur2User) {
        const testUserIds = [customer1User?.id, customer2User?.id, entrepreneur1User?.id, entrepreneur2User?.id].filter(Boolean);
        await prisma.user.deleteMany({
          where: { id: { in: testUserIds } },
        });
      }
      console.log('Cleanup completed successfully.');
    } catch (cleanupErr) {
      console.error('Error during cleanup:', cleanupErr);
    }

    if (server) {
      server.close();
    }

    // Count DB records AFTER
    const finalCounts = {
      users: await prisma.user.count(),
      businesses: await prisma.business.count(),
      services: await prisma.service.count(),
      inquiries: await prisma.inquiry.count(),
      orders: await prisma.order.count(),
      orderItems: await prisma.orderItem.count(),
    };

    console.log('\n--- DATABASE COUNTS AFTER CLEANUP ---');
    console.table(finalCounts);

    const countsMatch =
      initialCounts.users === finalCounts.users &&
      initialCounts.businesses === finalCounts.businesses &&
      initialCounts.services === finalCounts.services &&
      initialCounts.inquiries === finalCounts.inquiries &&
      initialCounts.orders === finalCounts.orders &&
      initialCounts.orderItems === finalCounts.orderItems;

    console.log(`\nDATABASE CLEANUP VERIFICATION: ${countsMatch ? 'CONFIRMED (Counts match perfectly before and after)' : 'WARNING (Counts do not match)'}`);

    await prisma.$disconnect();

    const allPassed = testResults.length === 17 && testResults.every((r) => r.status === 'PASSED');
    console.log(`\nOVERALL TEST SUITE RESULT: ${allPassed ? 'ALL 17 TESTS PASSED SUCCESSFULLY!' : 'SOME TESTS FAILED'}\n`);
  }
}

runTests();
