const prisma = require('../config/db');

const getAdminStats = async (req, res, next) => {
  try {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();

    // Period bounds for current calendar month (UTC server time)
    const monthStart = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(currentYear, currentMonth + 1, 1, 0, 0, 0, 0));

    const monthName = monthStart.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
    const periodLabel = `${monthName} ${currentYear}`;

    // Parallel optimized queries
    const [
      totalUsers,
      totalCustomers,
      registeredEntrepreneurs,
      totalAdmins,
      totalBusinesses,
      activeListings,
      totalOrders,
      totalInquiries,
      currentMonthInquiriesCount,
      inquiriesByActiveBusiness,
      monthlyActiveUsers,
      entrepreneurs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'ENTREPRENEUR' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.business.count(),
      prisma.business.count({ where: { verificationStatus: 'APPROVED' } }),
      prisma.order.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({
        where: {
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      }),
      prisma.inquiry.groupBy({
        by: ['businessId'],
        where: {
          createdAt: { gte: monthStart, lt: monthEnd },
          business: { verificationStatus: 'APPROVED' },
        },
      }),
      prisma.user.count({
        where: {
          role: { in: ['CUSTOMER', 'ENTREPRENEUR'] },
          lastActiveAt: { gte: monthStart, lt: monthEnd },
        },
      }),
      prisma.user.findMany({
        where: { role: 'ENTREPRENEUR' },
        select: {
          id: true,
          businesses: {
            select: {
              businessName: true,
              category: true,
              description: true,
              ownerName: true,
              location: true,
              serviceArea: true,
              pricingRange: true,
              _count: {
                select: {
                  services: true,
                  availability: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // KPI 3: Inquiry Rate calculation
    const activeBusinessesWithInquiryCount = inquiriesByActiveBusiness.length;
    const inquiryRatePercentage = activeListings > 0
      ? Number(((activeBusinessesWithInquiryCount / activeListings) * 100).toFixed(1))
      : 0;

    // KPI 5: Profile Completion calculation
    let totalCompletionSum = 0;
    let completeProfilesCount = 0;
    const totalProfilesEvaluated = entrepreneurs.length;

    if (totalProfilesEvaluated > 0) {
      for (const entrepreneur of entrepreneurs) {
        const business = entrepreneur.businesses[0];
        if (!business) {
          continue;
        }

        let completedFields = 0;
        if (business.businessName && business.businessName.trim() !== '') completedFields++;
        if (business.category && business.category.trim() !== '') completedFields++;
        if (business.description && business.description.trim() !== '') completedFields++;
        if (business.ownerName && business.ownerName.trim() !== '') completedFields++;
        if (business.location && business.location.trim() !== '') completedFields++;
        if (business.serviceArea && business.serviceArea.trim() !== '') completedFields++;
        if (business.pricingRange && business.pricingRange.trim() !== '') completedFields++;
        if (business._count && business._count.services > 0) completedFields++;
        if (business._count && business._count.availability > 0) completedFields++;

        const completionPct = (completedFields / 9) * 100;
        totalCompletionSum += completionPct;

        if (completedFields === 9) {
          completeProfilesCount++;
        }
      }
    }

    const averageProfileCompletion = totalProfilesEvaluated > 0
      ? Number((totalCompletionSum / totalProfilesEvaluated).toFixed(1))
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        // Preserved existing stats properties for backwards compatibility
        totalUsers,
        totalCustomers,
        totalEntrepreneurs: registeredEntrepreneurs,
        totalAdmins,
        totalBusinesses,
        totalOrders,
        totalInquiries,

        // Required 5 Platform KPIs
        registeredEntrepreneurs,
        activeListings,
        inquiryRate: {
          percentage: inquiryRatePercentage,
          inquiries: currentMonthInquiriesCount,
          activeBusinessesWithInquiry: activeBusinessesWithInquiryCount,
          totalActiveBusinesses: activeListings,
        },
        monthlyActiveUsers,
        profileCompletion: {
          averagePercentage: averageProfileCompletion,
          completeProfiles: completeProfilesCount,
          totalProfiles: totalProfilesEvaluated,
        },
        period: {
          start: monthStart.toISOString(),
          end: monthEnd.toISOString(),
          label: periodLabel,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const where = {};

    if (role) {
      const upperRole = String(role).toUpperCase();
      if (['CUSTOMER', 'ENTREPRENEUR', 'ADMIN'].includes(upperRole)) {
        where.role = upperRole;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid role filter. Allowed values: CUSTOMER, ENTREPRENEUR, ADMIN',
        });
      }
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminBusinesses = async (req, res, next) => {
  try {
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        businessName: true,
        category: true,
        description: true,
        ownerName: true,
        ownerId: true,
        experienceLevel: true,
        location: true,
        serviceArea: true,
        pricingRange: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) {
      const upperStatus = String(status).toUpperCase();
      const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
      if (validStatuses.includes(upperStatus)) {
        where.status = upperStatus;
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Allowed values: ${validStatuses.join(', ')}`,
        });
      }
    }

    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        status: true,
        totalAmount: true,
        customerName: true,
        customerPhone: true,
        deliveryAddress: true,
        createdAt: true,
        updatedAt: true,
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
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminInquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) {
      const upperStatus = String(status).toUpperCase();
      const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
      if (validStatuses.includes(upperStatus)) {
        where.status = upperStatus;
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Allowed values: ${validStatuses.join(', ')}`,
        });
      }
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        business: {
          select: {
            id: true,
            businessName: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

const getBusinessVerifications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status && status.toUpperCase() !== 'ALL') {
      const upper = status.toUpperCase();
      if (['PENDING', 'APPROVED', 'REJECTED'].includes(upper)) {
        where.verificationStatus = upper;
      }
    }

    const verifications = await prisma.business.findMany({
      where,
      select: {
        id: true,
        businessName: true,
        category: true,
        description: true,
        location: true,
        serviceArea: true,
        pricingRange: true,
        ownerName: true,
        ownerId: true,
        verificationStatus: true,
        verificationDetails: true,
        verificationReason: true,
        verifiedAt: true,
        verifiedById: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingCount = await prisma.business.count({
      where: { verificationStatus: 'PENDING' },
    });

    return res.status(200).json({
      success: true,
      pendingCount,
      count: verifications.length,
      data: verifications,
    });
  } catch (error) {
    next(error);
  }
};

const getBusinessVerificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const business = await prisma.business.findUnique({
      where: { id: numericId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        services: true,
        availability: true,
      },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

const approveBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verificationReason } = req.body;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const existing = await prisma.business.findUnique({ where: { id: numericId } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const updated = await prisma.business.update({
      where: { id: numericId },
      data: {
        verificationStatus: 'APPROVED',
        verifiedAt: new Date(),
        verifiedById: req.user.id,
        verificationReason: (verificationReason || 'Approved by Admin').trim(),
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Business "${updated.businessName}" approved successfully.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const rejectBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason, verificationReason } = req.body;
    const numericId = parseInt(id, 10);

    const reason = (rejectionReason || verificationReason || '').trim();

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required.',
      });
    }

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const existing = await prisma.business.findUnique({ where: { id: numericId } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const updated = await prisma.business.update({
      where: { id: numericId },
      data: {
        verificationStatus: 'REJECTED',
        verificationReason: reason,
        verifiedAt: null,
        verifiedById: req.user.id,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Business "${updated.businessName}" verification rejected.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminReports = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status && status !== 'ALL' && ['OPEN', 'REVIEWED', 'RESOLVED'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        business: {
          select: { id: true, businessName: true, category: true, ownerName: true },
        },
        order: {
          select: { id: true, totalAmount: true, status: true, customerName: true, createdAt: true },
        },
        inquiry: {
          select: { id: true, message: true, status: true, customerName: true, createdAt: true },
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

const getAdminReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    const report = await prisma.report.findUnique({
      where: { id: numericId },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        business: {
          select: { id: true, businessName: true, category: true, ownerName: true },
        },
        order: {
          select: { id: true, totalAmount: true, status: true, customerName: true, createdAt: true },
        },
        inquiry: {
          select: { id: true, message: true, status: true, customerName: true, createdAt: true },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    const ALLOWED_STATUSES = ['OPEN', 'REVIEWED', 'RESOLVED'];
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid report status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const report = await prisma.report.findUnique({ where: { id: numericId } });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    const currentStatus = report.status;
    const newStatus = status;

    if (currentStatus === 'RESOLVED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change status of a RESOLVED report (terminal state).',
      });
    }

    const isValidTransition =
      (currentStatus === 'OPEN' && (newStatus === 'REVIEWED' || newStatus === 'RESOLVED')) ||
      (currentStatus === 'REVIEWED' && newStatus === 'RESOLVED');

    if (!isValidTransition) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition report status from ${currentStatus} to ${newStatus}.`,
      });
    }

    const updatedReport = await prisma.report.update({
      where: { id: numericId },
      data: { status: newStatus },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        business: {
          select: { id: true, businessName: true, category: true },
        },
        order: {
          select: { id: true, totalAmount: true, status: true },
        },
        inquiry: {
          select: { id: true, message: true, status: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Report status updated successfully.',
      data: updatedReport,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  getAdminBusinesses,
  getAdminOrders,
  getAdminInquiries,
  getBusinessVerifications,
  getBusinessVerificationById,
  approveBusiness,
  rejectBusiness,
  getAdminReports,
  getAdminReportById,
  updateReportStatus,
};
