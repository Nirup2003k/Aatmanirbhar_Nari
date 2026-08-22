const prisma = require('../config/db');

const parseServicePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr || typeof priceStr !== 'string') return 0;
  const match = priceStr.match(/[\d]+(?:\.[\d]+)?/);
  if (match) {
    return parseFloat(match[0]);
  }
  return 0;
};

const createOrder = async (req, res, next) => {
  try {
    const { businessId, deliveryAddress, items } = req.body;

    const numBusinessId = parseInt(businessId, 10);
    if (isNaN(numBusinessId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid businessId',
      });
    }

    if (!deliveryAddress || typeof deliveryAddress !== 'string' || !deliveryAddress.trim()) {
      return res.status(400).json({
        success: false,
        message: 'deliveryAddress is required',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'items must be a non-empty array',
      });
    }

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: numBusinessId },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    // Validate item inputs
    const parsedItems = [];
    for (const item of items) {
      const serviceId = parseInt(item.serviceId, 10);
      const quantity = parseInt(item.quantity, 10);

      if (isNaN(serviceId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid serviceId in items',
        });
      }

      if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(Number(item.quantity))) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a positive integer',
        });
      }

      parsedItems.push({ serviceId, quantity });
    }

    // Fetch services from DB
    const serviceIds = parsedItems.map((i) => i.serviceId);
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    const uniqueServiceIdsCount = new Set(serviceIds).size;
    if (services.length !== uniqueServiceIdsCount) {
      return res.status(400).json({
        success: false,
        message: 'One or more requested services were not found',
      });
    }

    // Verify all services belong to specified business
    const serviceMap = new Map();
    for (const s of services) {
      if (s.businessId !== numBusinessId) {
        return res.status(400).json({
          success: false,
          message: `Service "${s.name}" does not belong to the selected business`,
        });
      }
      serviceMap.set(s.id, s);
    }

    // Snapshot prices and compute subtotals
    let totalAmount = 0;
    const orderItemsData = parsedItems.map((item) => {
      const service = serviceMap.get(item.serviceId);
      const unitPrice = parseServicePrice(service.price);
      const subtotal = Number((unitPrice * item.quantity).toFixed(2));
      totalAmount += subtotal;
      return {
        serviceId: item.serviceId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        subtotal: subtotal,
      };
    });

    totalAmount = Number(totalAmount.toFixed(2));

    // Derive customer info strictly from req.user
    const customerName = req.user.name;
    const customerPhone = req.user.phone;

    // Create Order and OrderItems in a Prisma transaction
    const order = await prisma.$transaction(async (tx) => {
      return await tx.order.create({
        data: {
          customerId: req.user.id,
          businessId: numBusinessId,
          status: 'PENDING',
          totalAmount: totalAmount,
          customerName: customerName,
          customerPhone: customerPhone,
          deliveryAddress: deliveryAddress.trim(),
          items: {
            create: orderItemsData,
          },
        },
        include: {
          business: {
            select: {
              id: true,
              businessName: true,
              category: true,
              location: true,
            },
          },
          items: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            category: true,
            location: true,
          },
        },
        items: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: numericId },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            category: true,
            location: true,
            ownerName: true,
          },
        },
        items: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: numericId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel your own orders.',
      });
    }

    const CANCELLABLE_STATUSES = ['PENDING', 'ACCEPTED'];
    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in its current status: ${order.status}`,
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: numericId },
      data: { status: 'CANCELLED' },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
          },
        },
        items: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getCustomerOrderById,
  cancelOrder,
};
