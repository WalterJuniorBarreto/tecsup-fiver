import prisma from '../config/db.js'; 

export const earningService = {
  getSummary: async (userId: string) => {
    const orders = await prisma.order.findMany({ where: { sellerId: userId } });
    const withdrawals = await prisma.withdrawal.findMany({ where: { sellerId: userId } });

    let pending = 0;
    let totalEarned = 0;

    orders.forEach(order => {
      if (['PAID', 'IN_PROGRESS', 'REVISION'].includes(order.status)) {
        pending += order.price; 
      }
      else if (order.status === 'COMPLETED') {
        totalEarned += order.price; 
      }
    });

    const totalWithdrawn = withdrawals.reduce((acc, w) => acc + w.amount, 0);

    const available = totalEarned - totalWithdrawn;

    const chartData = generarGraficoSeisMeses(orders.filter(o => o.status === 'COMPLETED'));

    return { available, pending, total: totalEarned, chart: chartData };
  },

  getTransactions: async (userId: string) => {
    const orders = await prisma.order.findMany({
      where: { sellerId: userId, status: 'COMPLETED' },
      include: { client: { select: { name: true, username: true } }, service: { select: { title: true } } }
    });
    const withdrawals = await prisma.withdrawal.findMany({ where: { sellerId: userId } });

    const mixedTransactions = [
      ...orders.map(o => ({
        id: o.id,
        type: 'EARNING',
        title: `Pago por: ${o.service.title}`,
        client: o.client.name || o.client.username,
        amount: o.price,
        date: o.createdAt,
        status: o.status
      })),
      ...withdrawals.map(w => ({
        id: w.id,
        type: 'WITHDRAWAL',
        title: 'Retiro a Cuenta Bancaria',
        client: w.method,
        amount: -w.amount, // En negativo porque es retiro
        date: w.createdAt,
        status: w.status
      }))
    ];

    return mixedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  requestWithdrawal: async (userId: string, amount: number, destination: string) => {
    const summary = await earningService.getSummary(userId);
    
    if (amount > summary.available) {
      throw new Error('No tienes saldo suficiente para este retiro.');
    }
    if (amount <= 0) {
      throw new Error('El monto de retiro debe ser mayor a 0.');
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        sellerId: userId,
        amount: amount,
        method: destination,
        status: 'PENDING'
      }
    });

    return withdrawal;
  }
};

function generarGraficoSeisMeses(completedOrders: any[]) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const ultimos6Meses: { name: string; year: number; ganancias: number }[] = [];
  const hoy = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    ultimos6Meses.push({ name: meses[d.getMonth()], year: d.getFullYear(), ganancias: 0 });
  }

  completedOrders.forEach(order => {
    const date = new Date(order.createdAt);
    const item = ultimos6Meses.find(m => m.name === meses[date.getMonth()] && m.year === date.getFullYear());
    if (item) {
      item.ganancias += order.price;
    }
  });

  return ultimos6Meses.map(m => ({ name: m.name, ganancias: m.ganancias }));
}