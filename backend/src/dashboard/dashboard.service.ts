import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async obtenerResumen() {
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);

    const [stockBajo, pedidosHoy, entregasHoy, masVendidos] = await Promise.all([
      this.prisma.producto.findMany({
        where: { stock: { lte: 10 } },
        include: { categoria: true },
        orderBy: { stock: 'asc' },
        take: 10,
      }),
      this.prisma.pedido.count({
        where: { creadoEn: { gte: inicioHoy } },
      }),
      this.prisma.entrega.count({
        where: { fecha: { gte: inicioHoy } },
      }),
      this.prisma.detallePedido.groupBy({
        by: ['productoId'],
        _sum: { cantidad: true },
        orderBy: { _sum: { cantidad: 'desc' } },
        take: 5,
      }),
    ]);

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