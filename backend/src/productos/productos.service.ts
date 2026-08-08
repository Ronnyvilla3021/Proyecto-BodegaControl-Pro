import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { MovimientoDto } from './dto/movimiento.dto';
import { TipoMovimiento } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateProductoDto) {
    const existe = await this.prisma.producto.findUnique({
      where: { codigo: dto.codigo },
    });

    if (existe) {
      throw new ConflictException('Ya existe un producto con ese código');
    }

    return this.prisma.producto.create({
      data: {
        codigo: dto.codigo,
        nombre: dto.nombre,
        precio: dto.precio,
        stock: dto.stock ?? 0,
        vencimiento: dto.vencimiento ? new Date(dto.vencimiento) : null,
        categoriaId: dto.categoriaId,
      },
      include: { categoria: true },
    });
  }

  async listar() {
    return this.prisma.producto.findMany({
      include: { categoria: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  // Aquí está el corazón del Kardex
  async registrarMovimiento(productoId: number, dto: MovimientoDto, usuarioId: number) {
    const producto = await this.buscarPorId(productoId);

    const stockAntes = producto.stock;
    let stockDespues: number;

    if (dto.tipo === TipoMovimiento.ENTRADA) {
      stockDespues = stockAntes + dto.cantidad;
    } else {
      // Validación clave: no puedes sacar más de lo que hay
      if (dto.cantidad > stockAntes) {
        throw new BadRequestException(
          `Stock insuficiente. Disponible: ${stockAntes}, solicitado: ${dto.cantidad}`,
        );
      }
      stockDespues = stockAntes - dto.cantidad;
    }

    // Transacción: o se hacen las dos cosas, o no se hace ninguna
    const [movimiento] = await this.prisma.$transaction([
      this.prisma.movimientoInventario.create({
        data: {
          productoId,
          tipo: dto.tipo,
          cantidad: dto.cantidad,
          stockAntes,
          stockDespues,
          motivo: dto.motivo,
          usuarioId,
        },
      }),
      this.prisma.producto.update({
        where: { id: productoId },
        data: { stock: stockDespues },
      }),
    ]);

    return movimiento;
  }

  async kardex(productoId: number) {
    await this.buscarPorId(productoId); // valida que el producto exista

    return this.prisma.movimientoInventario.findMany({
      where: { productoId },
      orderBy: { creadoEn: 'desc' },
      include: {
        usuario: { select: { nombre: true, email: true } },
      },
    });
  }

  async productosStockBajo(umbral = 10) {
    return this.prisma.producto.findMany({
      where: { stock: { lte: umbral } },
      include: { categoria: true },
      orderBy: { stock: 'asc' },
    });
  }
}