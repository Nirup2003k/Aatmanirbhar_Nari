const prisma = require('../config/db');

/**
 * Generate a URL-safe slug from string
 * @param {string} text
 */
const generateSlug = (text) => {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Get active categories for public/customer/entrepreneur usage
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories (including inactive) for Admin management
 */
const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { businesses: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map((cat) => ({
        ...cat,
        businessCount: cat._count.businesses,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Category (Admin only)
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, isActive } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const trimmedName = name.trim();
    const finalSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(trimmedName);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category name or slug.',
      });
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: trimmedName, mode: 'insensitive' } },
          { slug: finalSlug },
        ],
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists.',
      });
    }

    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        slug: finalSlug,
        description: description ? String(description).trim() : null,
        icon: icon ? String(icon).trim() : 'Store',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing Category (Admin only)
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, isActive } = req.body;

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID.',
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedId },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const updateData = {};

    if (name !== undefined) {
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Category name cannot be empty.',
        });
      }
      updateData.name = name.trim();
    }

    if (slug !== undefined || updateData.name) {
      const targetSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(updateData.name || category.name);
      updateData.slug = targetSlug;
    }

    if (description !== undefined) {
      updateData.description = description ? String(description).trim() : null;
    }

    if (icon !== undefined) {
      updateData.icon = icon ? String(icon).trim() : 'Store';
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    // Check for collisions if name or slug is changing
    if (updateData.name || updateData.slug) {
      const existingCollision = await prisma.category.findFirst({
        where: {
          NOT: { id: parsedId },
          OR: [
            updateData.name ? { name: { equals: updateData.name, mode: 'insensitive' } } : undefined,
            updateData.slug ? { slug: updateData.slug } : undefined,
          ].filter(Boolean),
        },
      });

      if (existingCollision) {
        return res.status(400).json({
          success: false,
          message: 'Another category with this name or slug already exists.',
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parsedId },
      data: updateData,
    });

    // If category name updated, update legacy category string on linked businesses
    if (updateData.name && updateData.name !== category.name) {
      await prisma.business.updateMany({
        where: { categoryId: parsedId },
        data: { category: updateData.name },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle Category active status (Admin only)
 */
const toggleCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID.',
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedId },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const newActiveState = isActive !== undefined ? Boolean(isActive) : !category.isActive;

    const updatedCategory = await prisma.category.update({
      where: { id: parsedId },
      data: { isActive: newActiveState },
    });

    res.status(200).json({
      success: true,
      message: `Category ${newActiveState ? 'activated' : 'deactivated'} successfully.`,
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete category (Admin only) - soft delete / deactivation if referenced
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID.',
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedId },
      include: {
        _count: {
          select: { businesses: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    if (category._count.businesses > 0) {
      // Soft-delete / deactivate category to preserve existing business relationships
      const deactivatedCategory = await prisma.category.update({
        where: { id: parsedId },
        data: { isActive: false },
      });

      return res.status(200).json({
        success: true,
        message: `Category is assigned to ${category._count.businesses} business(es). It has been deactivated instead of hard-deleted to preserve business records.`,
        data: deactivatedCategory,
      });
    }

    await prisma.category.delete({
      where: { id: parsedId },
    });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
};
