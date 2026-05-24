import prisma from '../config/db.js';

export const moderationService = {
  
  createReport: async (reporterId: string, reason: string, targetType: 'USER' | 'SERVICE', targetId: string) => {
    
    const data: any = {
      reporterId,
      reason,
      status: 'PENDING'
    };

    if (targetType === 'USER') {
      const userExists = await prisma.user.findUnique({ where: { id: targetId } });
      if (!userExists) throw new Error('El usuario a reportar no existe.');
      data.reportedUserId = targetId;
    } else {
      const serviceExists = await prisma.service.findUnique({ where: { id: targetId } });
      if (!serviceExists) throw new Error('El servicio a reportar no existe.');
      data.reportedServiceId = targetId;
    }

    return await prisma.report.create({ data });
  },

  getReports: async (status?: string) => {
    const whereClause = status && status !== 'ALL' ? { status } : {};

    const reports = await prisma.report.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { name: true, email: true } },
        reportedUser: { select: { name: true, email: true, role: true, isActive: true } },
        reportedService: { select: { title: true, price: true, isPublished: true, seller: { select: { name: true } } } }
      }
    });

    return reports.map(r => ({
      id: r.id,
      reason: r.reason,
      status: r.status,
      date: r.createdAt.toISOString(),
      reporterName: r.reporter.name || r.reporter.email,
      type: r.reportedServiceId ? 'SERVICE' : 'USER',
      targetInfo: r.reportedServiceId 
        ? { id: r.reportedServiceId, title: r.reportedService?.title, owner: r.reportedService?.seller.name, isActive: r.reportedService?.isPublished }
        : { id: r.reportedUserId, name: r.reportedUser?.name, role: r.reportedUser?.role, isActive: r.reportedUser?.isActive }
    }));
  },

  updateReportStatus: async (reportId: string, status: 'RESOLVED' | 'DISMISSED') => {
    return await prisma.report.update({
      where: { id: reportId },
      data: { status }
    });
  }
};