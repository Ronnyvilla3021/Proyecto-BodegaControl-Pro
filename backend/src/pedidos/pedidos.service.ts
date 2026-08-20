import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { EstadoPedido, TipoMovimiento } from '@prisma/client';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreatePedidoDto, usuarioId: number) {
    // 1. Trae los productos involucrados para validar stock y calcular precios reales
    const productoIds = dto.items.map((i) => i.productoId);
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: productoIds } },
    });

    if (productos.length !== productoIds.length) {
      throw new BadRequestException('Uno o más productos no existen');
    }

    // 2. Valida stock disponible y calcula subtotales
    let total = 0;
    const detalles = dto.items.map((item) => {
      const producto = productos.find((p) => p.id === item.productoId)!;

      if (item.cantidad > producto.stock) {
        throw new BadRequestException(
          `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`,
        );
      }

      const precioUnitario = Number(producto.precio);
      const subtotal = precioUnitario * item.cantidad;
      total += subtotal;

      return {
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal,
      };
    });

    // 3. Crea el pedido con sus detalles en una sola operación
    return this.prisma.pedido.create({
      data: {
        clienteId: dto.clienteId,
        usuarioId,
        total,
        detalles: { create: detalles },
      },
      include: { detalles: { include: { producto: true } }, cliente: true },
    });
  }

  async listar() {
    return this.prisma.pedido.findMany({
      include: { cliente: true, detalles: { include: { producto: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async buscarPorId(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { cliente: true, detalles: { include: { producto: true } }, usuario: { select: { nombre: true } } },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }

  async asignarRepartidor(id: number, repartidorId: number) {
  const pedido = await this.buscarPorId(id);

  if (pedido.estado === EstadoPedido.ENTREGADO) {
    throw new BadRequestException('No se puede reasignar un pedido ya entregado');
  }

  const repartidor = await this.prisma.usuario.findUnique({ where: { id: repartidorId } });

  if (!repartidor || repartidor.rol !== 'REPARTIDOR') {
    throw new BadRequestException('El usuario indicado no es un repartidor válido');
  }

  return this.prisma.pedido.update({
    where: { id },
    data: { repartidorId },
    include: { cliente: true, repartidor: { select: { id: true, nombre: true } } },
  });
}

async misPedidos(repartidorId: number) {
  return this.prisma.pedido.findMany({
    where: { repartidorId, estado: EstadoPedido.EN_RUTA },
    include: { cliente: true, detalles: { include: { producto: true } } },
    orderBy: { creadoEn: 'asc' },
  });
}

  async cambiarEstado(id: number, nuevoEstado: EstadoPedido, usuarioId: number) {
    const pedido = await this.buscarPorId(id);

    this.validarTransicion(pedido.estado, nuevoEstado);

    // Cuando pasa a EMPACADO, descuenta stock real usando el Kardex
    if (nuevoEstado === EstadoPedido.EMPACADO) {
      const operaciones = pedido.detalles.map((detalle) =>
        this.prisma.movimientoInventario.create({
          data: {
            productoId: detalle.productoId,
            tipo: TipoMovimiento.SALIDA,
            cantidad: detalle.cantidad,
            stockAntes: detalle.producto.stock,
            stockDespues: detalle.producto.stock - detalle.cantidad,
            motivo: `Pedido #${pedido.id} empacado`,
            usuarioId,
          },
        }),
      );

      const actualizacionesStock = pedido.detalles.map((detalle) =>
        this.prisma.producto.update({
          where: { id: detalle.productoId },
          data: { stock: { decrement: detalle.cantidad } },
        }),
      );

      await this.prisma.$transaction([
        ...operaciones,
        ...actualizacionesStock,
        this.prisma.pedido.update({ where: { id }, data: { estado: nuevoEstado } }),
      ]);

      return this.buscarPorId(id);
    }

    return this.prisma.pedido.update({ where: { id }, data: { estado: nuevoEstado } });
  }

  private validarTransicion(actual: EstadoPedido, siguiente: EstadoPedido) {
    const transicionesValidas: Record<EstadoPedido, EstadoPedido[]> = {
      PENDIENTE: [EstadoPedido.EMPACADO],
      EMPACADO: [EstadoPedido.EN_RUTA],
      EN_RUTA: [EstadoPedido.ENTREGADO],
      ENTREGADO: [],
    };

    if (!transicionesValidas[actual].includes(siguiente)) {
      throw new BadRequestException(
        `No se puede cambiar de ${actual} a ${siguiente}. Transición no permitida.`,
      );
    }
  }
}