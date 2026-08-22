const prisma = require('../config/db');

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getAllBusinesses = async (req, res, next) => {
  try {
    const { search, location, category, availability } = req.query;

    const whereConditions = [];

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      whereConditions.push({
        OR: [
          { businessName: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          {
            services: {
              some: {
                name: { contains: searchTerm, mode: 'insensitive' },
              },
            },
          },
        ],
      });
    }

    if (location && location.trim() !== '') {
      whereConditions.push({
        location: { contains: location.trim(), mode: 'insensitive' },
      });
    }

    if (category && category.trim() !== '') {
      whereConditions.push({
        category: { contains: category.trim(), mode: 'insensitive' },
      });
    }

    if (availability && availability.trim() !== '') {
      const availTerm = availability.trim().toLowerCase();
      if (availTerm === 'true' || availTerm === 'available') {
        whereConditions.push({
          availability: {
            some: {
              isAvailable: true,
            },
          },
        });
      }
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const businesses = await prisma.business.findMany({
      where,
      include: {
        services: true,
        availability: true,
      },
      orderBy: {
        id: 'asc',
      },
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

const getBusinessById = async (req, res, next) => {
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

const createBusiness = async (req, res, next) => {
  try {
    const {
      businessName,
      category,
      description,
      experienceLevel,
      location,
      serviceArea,
      pricingRange,
      services,
      availability,
    } = req.body;

    if (!businessName || !businessName.trim() || !category || !category.trim() || !location || !location.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Missing required business fields (businessName, category, location).',
      });
    }

    // Explicitly derive ownerId and ownerName from authenticated req.user
    const ownerId = req.user.id;
    const ownerName = req.user.name || 'Entrepreneur';

    // Enforce 1 Business Per Entrepreneur rule
    const existingBusiness = await prisma.business.findFirst({
      where: { ownerId },
    });

    if (existingBusiness) {
      return res.status(409).json({
        success: false,
        message: 'You already have a registered business.',
      });
    }

    const business = await prisma.business.create({
      data: {
        businessName: businessName.trim(),
        category: category.trim(),
        description: (description || '').trim(),
        ownerName,
        ownerId,
        experienceLevel: (experienceLevel || 'New Entrepreneur').trim(),
        location: location.trim(),
        serviceArea: (serviceArea || location).trim(),
        pricingRange: (pricingRange || 'Contact for pricing').trim(),
        services: services && Array.isArray(services) ? {
          create: services.map((s) => ({
            name: String(s.name || '').trim(),
            description: String(s.description || '').trim(),
            price: String(s.price || '').trim(),
            availability: String(s.availability || 'Available').trim(),
          })),
        } : undefined,
        availability: availability && Array.isArray(availability) ? {
          create: availability.map((a) => ({
            dayOfWeek: a.dayOfWeek || a.day,
            isAvailable: a.isAvailable ?? true,
            startTime: String(a.startTime || '09:00 AM').trim(),
            endTime: String(a.endTime || '07:00 PM').trim(),
          })),
        } : undefined,
      },
      include: {
        services: true,
        availability: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Business created successfully',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

const updateBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const existingBusiness = await prisma.business.findUnique({
      where: { id: numericId },
    });

    if (!existingBusiness) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    // Ownership Enforcement
    if (existingBusiness.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this business.',
      });
    }

    const {
      businessName,
      category,
      description,
      experienceLevel,
      location,
      serviceArea,
      pricingRange,
    } = req.body;

    const updateData = {};

    if (businessName !== undefined) updateData.businessName = String(businessName).trim();
    if (category !== undefined) updateData.category = String(category).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (experienceLevel !== undefined) updateData.experienceLevel = String(experienceLevel).trim();
    if (location !== undefined) updateData.location = String(location).trim();
    if (serviceArea !== undefined) updateData.serviceArea = String(serviceArea).trim();
    if (pricingRange !== undefined) updateData.pricingRange = String(pricingRange).trim();

    const updatedBusiness = await prisma.business.update({
      where: { id: numericId },
      data: updateData,
      include: {
        services: true,
        availability: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Business updated successfully',
      data: updatedBusiness,
    });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
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
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    if (business.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this business.',
      });
    }

    const { name, description, price, availability } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Service name is required',
      });
    }

    const newService = await prisma.service.create({
      data: {
        businessId: numericId,
        name: String(name).trim(),
        description: String(description || '').trim(),
        price: String(price || '').trim(),
        availability: String(availability || 'Available').trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService,
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const { id, serviceId } = req.params;
    const numericBusinessId = parseInt(id, 10);
    const numericServiceId = parseInt(serviceId, 10);

    if (isNaN(numericBusinessId)) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    if (isNaN(numericServiceId)) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    const business = await prisma.business.findUnique({
      where: { id: numericBusinessId },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    if (business.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this business.',
      });
    }

    const service = await prisma.service.findUnique({
      where: { id: numericServiceId },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    if (service.businessId !== numericBusinessId) {
      return res.status(400).json({
        success: false,
        message: 'Selected service does not belong to this business',
      });
    }

    const { name, description, price, availability } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = String(name).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (price !== undefined) updateData.price = String(price).trim();
    if (availability !== undefined) updateData.availability = String(availability).trim();

    const updatedService = await prisma.service.update({
      where: { id: numericServiceId },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvailability = async (req, res, next) => {
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
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    if (business.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this business.',
      });
    }

    const { availability } = req.body;

    if (!availability || !Array.isArray(availability) || availability.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Availability schedule array is required.',
      });
    }

    for (const item of availability) {
      const day = item.dayOfWeek || item.day;
      if (!day || !VALID_DAYS.includes(day)) {
        return res.status(400).json({
          success: false,
          message: `Invalid dayOfWeek: '${day}'. Must be one of ${VALID_DAYS.join(', ')}.`,
        });
      }
      if (typeof item.isAvailable !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: `isAvailable must be a boolean for day '${day}'.`,
        });
      }
    }

    const updatedAvailabilityList = [];

    for (const item of availability) {
      const day = item.dayOfWeek || item.day;
      const isAvail = Boolean(item.isAvailable);
      const startTime = String(item.startTime || (isAvail ? '09:00 AM' : '-')).trim();
      const endTime = String(item.endTime || (isAvail ? '07:00 PM' : '-')).trim();

      const existingRow = await prisma.businessAvailability.findFirst({
        where: {
          businessId: numericId,
          dayOfWeek: day,
        },
      });

      if (existingRow) {
        const updatedRow = await prisma.businessAvailability.update({
          where: { id: existingRow.id },
          data: {
            isAvailable: isAvail,
            startTime,
            endTime,
          },
        });
        updatedAvailabilityList.push(updatedRow);
      } else {
        const newRow = await prisma.businessAvailability.create({
          data: {
            businessId: numericId,
            dayOfWeek: day,
            isAvailable: isAvail,
            startTime,
            endTime,
          },
        });
        updatedAvailabilityList.push(newRow);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Business availability updated successfully',
      data: updatedAvailabilityList,
    });
  } catch (error) {
    next(error);
  }
};

const createInquiry = async (req, res, next) => {
  try {
    const { businessId, serviceId, customerName, customerEmail, customerPhone, message } = req.body;

    if (!businessId || !serviceId || !customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required inquiry fields.',
      });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        businessId: Number(businessId),
        serviceId: Number(serviceId),
        customerName,
        customerEmail: customerEmail || '',
        customerPhone,
        message: message || '',
      },
    });

    return res.status(201).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  createService,
  updateService,
  updateAvailability,
  createInquiry,
};
