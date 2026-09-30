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
 * Get published learning resources (Public API)
 */
const getLearningResources = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const whereConditions = [{ isPublished: true }];

    if (category && category.trim() !== '' && category.trim().toLowerCase() !== 'all') {
      whereConditions.push({
        category: { equals: category.trim(), mode: 'insensitive' },
      });
    }

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      whereConditions.push({
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ],
      });
    }

    const resources = await prisma.learningContent.findMany({
      where: { AND: whereConditions },
      orderBy: { id: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single published learning resource by slug or ID (Public API)
 */
const getLearningResourceBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    if (!slugOrId) {
      return res.status(404).json({
        success: false,
        message: 'Learning resource not found',
      });
    }

    const numericId = parseInt(slugOrId, 10);
    const isNumeric = !isNaN(numericId) && String(numericId) === slugOrId.trim();

    const resource = await prisma.learningContent.findFirst({
      where: isNumeric
        ? { OR: [{ id: numericId }, { slug: slugOrId.trim() }] }
        : { slug: slugOrId.trim() },
    });

    // Require published status for public access (unless requester is Admin)
    const isAdmin = req.user && req.user.role === 'ADMIN';

    if (!resource || (!resource.isPublished && !isAdmin)) {
      return res.status(404).json({
        success: false,
        message: 'Learning article not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all learning resources including drafts for Admin (Admin API)
 */
const getAdminLearningResources = async (req, res, next) => {
  try {
    const resources = await prisma.learningContent.findMany({
      orderBy: { id: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Learning Resource (Admin API)
 */
const createLearningResource = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      summary,
      readTime,
      author,
      publishedDate,
      sections,
      keyTakeaways,
      isPublished,
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article title is required.',
      });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article category is required.',
      });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Article description is required.',
      });
    }

    const trimmedTitle = title.trim();
    const finalSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(trimmedTitle);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article title or slug.',
      });
    }

    const existingSlug = await prisma.learningContent.findUnique({
      where: { slug: finalSlug },
    });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'An article with this URL slug already exists.',
      });
    }

    let parsedSections = sections;
    if (typeof sections === 'string') {
      try {
        parsedSections = JSON.parse(sections);
      } catch {
        parsedSections = [];
      }
    }

    let parsedKeyTakeaways = keyTakeaways;
    if (typeof keyTakeaways === 'string') {
      try {
        parsedKeyTakeaways = JSON.parse(keyTakeaways);
      } catch {
        parsedKeyTakeaways = keyTakeaways.split('\n').map((s) => s.trim()).filter(Boolean);
      }
    }

    const newResource = await prisma.learningContent.create({
      data: {
        title: trimmedTitle,
        slug: finalSlug,
        category: category.trim(),
        description: description.trim(),
        summary: summary ? String(summary).trim() : null,
        readTime: readTime && String(readTime).trim() ? String(readTime).trim() : '5 min read',
        author: author && String(author).trim() ? String(author).trim() : 'Aatmanirbhar Nari Mentorship Desk',
        publishedDate: publishedDate ? String(publishedDate).trim() : 'August 2026',
        sections: parsedSections || [],
        keyTakeaways: parsedKeyTakeaways || [],
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Learning resource created successfully.',
      data: newResource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing Learning Resource (Admin API)
 */
const updateLearningResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid learning resource ID.',
      });
    }

    const resource = await prisma.learningContent.findUnique({
      where: { id: numericId },
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Learning resource not found.',
      });
    }

    const {
      title,
      slug,
      category,
      description,
      summary,
      readTime,
      author,
      publishedDate,
      sections,
      keyTakeaways,
      isPublished,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty.',
        });
      }
      updateData.title = title.trim();
    }

    if (slug !== undefined || updateData.title) {
      const targetSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(updateData.title || resource.title);
      if (targetSlug !== resource.slug) {
        const existingSlug = await prisma.learningContent.findFirst({
          where: {
            slug: targetSlug,
            NOT: { id: numericId },
          },
        });
        if (existingSlug) {
          return res.status(400).json({
            success: false,
            message: 'Another article with this URL slug already exists.',
          });
        }
        updateData.slug = targetSlug;
      }
    }

    if (category !== undefined) updateData.category = String(category).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (summary !== undefined) updateData.summary = summary ? String(summary).trim() : null;
    if (readTime !== undefined) updateData.readTime = String(readTime).trim();
    if (author !== undefined) updateData.author = String(author).trim();
    if (publishedDate !== undefined) updateData.publishedDate = publishedDate ? String(publishedDate).trim() : null;
    if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);

    if (sections !== undefined) {
      let parsedSections = sections;
      if (typeof sections === 'string') {
        try {
          parsedSections = JSON.parse(sections);
        } catch {
          parsedSections = resource.sections;
        }
      }
      updateData.sections = parsedSections;
    }

    if (keyTakeaways !== undefined) {
      let parsedKeyTakeaways = keyTakeaways;
      if (typeof keyTakeaways === 'string') {
        try {
          parsedKeyTakeaways = JSON.parse(keyTakeaways);
        } catch {
          parsedKeyTakeaways = keyTakeaways.split('\n').map((s) => s.trim()).filter(Boolean);
        }
      }
      updateData.keyTakeaways = parsedKeyTakeaways;
    }

    const updatedResource = await prisma.learningContent.update({
      where: { id: numericId },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: 'Learning resource updated successfully.',
      data: updatedResource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle Learning Resource publication status (Admin API)
 */
const toggleLearningResourceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid learning resource ID.',
      });
    }

    const resource = await prisma.learningContent.findUnique({
      where: { id: numericId },
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Learning resource not found.',
      });
    }

    const newPublishedStatus = isPublished !== undefined ? Boolean(isPublished) : !resource.isPublished;

    const updatedResource = await prisma.learningContent.update({
      where: { id: numericId },
      data: { isPublished: newPublishedStatus },
    });

    return res.status(200).json({
      success: true,
      message: `Article ${newPublishedStatus ? 'published' : 'unpublished'} successfully.`,
      data: updatedResource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a Learning Resource (Admin API)
 */
const deleteLearningResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid learning resource ID.',
      });
    }

    const resource = await prisma.learningContent.findUnique({
      where: { id: numericId },
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Learning resource not found.',
      });
    }

    await prisma.learningContent.delete({
      where: { id: numericId },
    });

    return res.status(200).json({
      success: true,
      message: 'Learning resource deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLearningResources,
  getLearningResourceBySlugOrId,
  getAdminLearningResources,
  createLearningResource,
  updateLearningResource,
  toggleLearningResourceStatus,
  deleteLearningResource,
};
