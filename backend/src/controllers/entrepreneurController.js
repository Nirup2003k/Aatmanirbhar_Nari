const prisma = require('../config/db');

const getEntrepreneurBusinesses = async (req, res, next) => {
  try {
    const businesses = await prisma.business.findMany({
      where: { ownerId: req.user.id },
      include: {
        services: true,
        availability: true,
      },
      orderBy: { id: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

const getEntrepreneurInquiries = async (req, res, next) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: {
        business: {
          ownerId: req.user.id,
        },
      },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            category: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

const getEntrepreneurOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        business: {
          ownerId: req.user.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        business: {
          select: {
            id: true,
            businessName: true,
            category: true,
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

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getEntrepreneurOrderById = async (req, res, next) => {
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
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        business: {
          select: {
            id: true,
            businessName: true,
            category: true,
            ownerId: true,
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

    if (order.business.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Order does not belong to your business.',
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

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const VALID_STATUSES = [
      'PENDING',
      'ACCEPTED',
      'REJECTED',
      'PREPARING',
      'READY',
      'COMPLETED',
      'CANCELLED',
    ];

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: numericId },
      include: {
        business: {
          select: {
            ownerId: true,
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

    if (order.business.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Order does not belong to your business.',
      });
    }

    const ALLOWED_TRANSITIONS = {
      PENDING: ['ACCEPTED', 'REJECTED'],
      ACCEPTED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY'],
      READY: ['COMPLETED'],
      COMPLETED: [],
      REJECTED: [],
      CANCELLED: [],
    };

    const validNextStatuses = ALLOWED_TRANSITIONS[order.status] || [];
    if (!validNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition order status from ${order.status} to ${status}. Allowed transitions: ${
          validNextStatuses.join(', ') || 'none (terminal state)'
        }`,
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: numericId },
      data: { status },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
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
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const updateVerificationDetails = async (req, res, next) => {
  try {
    const { verificationDetails } = req.body;

    if (!verificationDetails || !verificationDetails.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Verification details are required.',
      });
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: req.user.id },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'No registered business found for your account.',
      });
    }

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        verificationDetails: verificationDetails.trim(),
        verificationStatus: 'PENDING',
        verificationReason: null,
      },
      include: {
        services: true,
        availability: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Verification details updated and submitted for admin review.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEntrepreneurBusinesses,
  getEntrepreneurInquiries,
  getEntrepreneurOrders,
  getEntrepreneurOrderById,
  updateOrderStatus,
  updateVerificationDetails,
};
