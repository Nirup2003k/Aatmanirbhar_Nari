const prisma = require('../config/db');

const createInquiry = async (req, res, next) => {
  try {
    const { businessId, serviceId, customerName, customerEmail, customerPhone, message } = req.body;

    const numBusinessId = parseInt(businessId, 10);
    const numServiceId = parseInt(serviceId, 10);

    if (isNaN(numBusinessId)) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    if (isNaN(numServiceId)) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
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

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: numServiceId },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Verify service belongs to selected business
    if (service.businessId !== numBusinessId) {
      return res.status(400).json({
        success: false,
        message: 'Selected service does not belong to this business',
      });
    }

    const nameToUse = (customerName && customerName.trim()) || req.user.name;
    const emailToUse = (customerEmail && customerEmail.trim()) || req.user.email;
    const phoneToUse = (customerPhone && customerPhone.trim()) || req.user.phone;

    if (!nameToUse) {
      return res.status(400).json({
        success: false,
        message: 'customerName is required',
      });
    }

    if (!phoneToUse) {
      return res.status(400).json({
        success: false,
        message: 'customerPhone is required',
      });
    }

    // customerId is strictly derived from authenticated req.user.id
    const inquiry = await prisma.inquiry.create({
      data: {
        businessId: numBusinessId,
        serviceId: numServiceId,
        customerId: req.user.id,
        customerName: nameToUse,
        customerEmail: emailToUse || '',
        customerPhone: phoneToUse,
        message: (message || '').trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    const ALLOWED_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid inquiry status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: numericId },
      include: {
        business: true,
      },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Ownership Enforcement
    if (inquiry.business.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own the business associated with this inquiry.',
      });
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id: numericId },
      data: { status },
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
    });

    return res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: updatedInquiry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  updateInquiryStatus,
};
