import prisma from '../config/db.js';

export const categoryService = {
  getAllCategories: async (includeInactive = false) => {
    return prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { services: true } }
      }
    });
  },

  createCategory: async (data: { name: string; description?: string }) => {
    const slug = data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");

    const exists = await prisma.category.findUnique({ where: { slug } });
    if (exists) throw new Error('Ya existe una categoría con ese nombre.');

    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description
      }
    });
  },

  updateCategory: async (id: string, data: { name?: string; description?: string; isActive?: boolean }) => {
    let newSlug;
    
    if (data.name) {
      newSlug = data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");

      const existingCategory = await prisma.category.findFirst({
        where: {
          OR: [{ name: data.name }, { slug: newSlug }],
          NOT: { id: id } 
        }
      });

      if (existingCategory) {
        const error: any = new Error('Ya existe otra categoría con este nombre.');
        error.statusCode = 400;
        throw error;
      }
    }

    return prisma.category.update({
      where: { id },
      data: {
        ...data,
        ...(newSlug && { slug: newSlug })
      }
    });
  },

  deleteCategory: async (id: string) => {
    const category = await prisma.category.findUnique({ 
      where: { id },
      include: { _count: { select: { services: true } } }
    });

    if (!category) throw new Error('Categoría no encontrada');

    if (category._count.services > 0) {
      return prisma.category.update({
        where: { id },
        data: { isActive: false }
      });
    } else {
      return prisma.category.delete({
        where: { id }
      });
    }
  }
};