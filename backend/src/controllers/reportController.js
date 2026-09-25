const prisma = require('../config/db');

const createReport = async (req, res, next) => {
  try {
    const { businessId, orderId, inquiryId, reason, description } = req.body;

    const numBusinessId = businessId !== undefined && businessId !== null ? parseInt(businessId, 10) : null;
    const numOrderId = orderId !== undefined && orderId !== null ? parseInt(orderId, 10) : null;
    const numInquiryId = inquiryId !== undefined && inquiryId !== null ? parseInt(inquiryId, 10) : null;

    if (!numBusinessId && !numOrderId && !numInquiryId) {
      return res.status(400).json({
        success: false,
        message: 'At least one report target (business, order, or inquiry) is required.',
      });
    }

    if (!reason || !String(reason).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Report reason is required.',
      });
    }

    // Verify target existence in database
    if (numBusinessId) {
      if (isNaN(numBusinessId)) {
        return res.status(400).json({ success: false, message: 'Invalid businessId' });
      }
      const business = await prisma.business.findUnique({ where: { id: numBusinessId } });
      if (!business) {
        return res.status(404).json({ success: false, message: 'Target business not found.' });
      }
    }

    if (numOrderId) {
      if (isNaN(numOrderId)) {
        return res.status(400).json({ success: false, message: 'Invalid orderId' });
      }
      const order = await prisma.order.findUnique({ where: { id: numOrderId } });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Target order not found.' });
      }
    }

    if (numInquiryId) {
      if (isNaN(numInquiryId)) {
        return res.status(400).json({ success: false, message: 'Invalid inquiryId' });
      }
      const inquiry = await prisma.inquiry.findUnique({ where: { id: numInquiryId } });
      if (!inquiry) {
        return res.status(404).json({ success: false, message: 'Target inquiry not found.' });
      }
    }

    const sanitizedDescription = description ? String(description).trim().substring(0, 1000) : null;

    // reporterId is strictly derived from authenticated req.user.id
    const report = await prisma.report.create({
      data: {
        reporterId: req.user.id,
        businessId: numBusinessId || undefined,
        orderId: numOrderId || undefined,
        inquiryId: numInquiryId || undefined,
        reason: String(reason).trim(),
        description: sanitizedDescription,
        status: 'OPEN',
      },
      include: {
        business: {
          select: { id: true, businessName: true, category: true },
        },
        order: {
          select: { id: true, totalAmount: true, status: true, createdAt: true },
        },
        inquiry: {
          select: { id: true, message: true, status: true, createdAt: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerReports = async (req, res, next) => {
  try {
    const reports = await prisma.report.findMany({
      where: {
        reporterId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        business: {
          select: { id: true, businessName: true, category: true },
        },
        order: {
          select: { id: true, totalAmount: true, status: true, createdAt: true },
        },
        inquiry: {
          select: { id: true, message: true, status: true, createdAt: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getCustomerReports,
};
