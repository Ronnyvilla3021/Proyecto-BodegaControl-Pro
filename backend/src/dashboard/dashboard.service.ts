import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async obtenerResumen() {
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);

    const [stockBajo, pedidosHoy, entregasHoy, masVendidos] = await Promise.all([
      // Widget 1: productos con stock bajo (umbral 10 por defecto)
      this.prisma.producto.findMany({
        where: { stock: { lte: 10 } },
        include: { categoria: true },
        orderBy: { stock: 'asc' },
        take: 10,
      }),

      // Widget 2: pedidos creados hoy
      this.prisma.pedido.count({
        where: { creadoEn: { gte: inicioHoy } },
      }),

      // Widget 3: entregas confirmadas hoy
      this.prisma.entrega.count({
        where: { fecha: { gte: inicioHoy } },
      }),

      // Widget 4: productos más vendidos (top 5, agrupado por producto)
      this.prisma.detallePedido.groupBy({
        by: ['productoId'],
        _sum: { cantidad: true },
        orderBy: { _sum: { cantidad: 'desc' } },
        take: 5,
      }),
    ]);

    // Enriquece "más vendidos" con el nombre del producto (groupBy no trae relaciones)
    const productosIds = masVendidos.map((m) => m.productoId);
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, nombre: true, codigo: true },
    });

    const productosVendidos = masVendidos.map((m) => ({
      producto: productos.find((p) => p.id === m.productoId),
      cantidadVendida: m._sum.cantidad,
    }));

    return {
      timestamp: new Date().toISOString(),
      stockBajo,
      pedidosHoy,
      entregasHoy,
      productosVendidos,
    };
  }
}