import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { EstadoPedido } from '@prisma/client';

@Injectable()
export class EntregasService {
  constructor(private prisma: PrismaService) {}

  async confirmar(dto: CreateEntregaDto, repartidorId: number) {
    // Buscar el pedido incluyendo el repartidorId
    const pedido = await this.prisma.pedido.findUnique({
      where: { id: dto.pedidoId },
      include: { entrega: true }
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    // Verificar que el repartidor esté asignado al pedido
    if (pedido.repartidorId !== repartidorId) {
      throw new ForbiddenException('Este pedido no está asignado a ti');
    }

    if (pedido.estado !== EstadoPedido.EN_RUTA) {
      throw new BadRequestException('Solo se puede confirmar entrega de un pedido en ruta');
    }

    // Verificar si ya tiene entrega
    if (pedido.entrega) {
      throw new BadRequestException('Este pedido ya tiene una entrega registrada');
    }

    // Crear la entrega y actualizar el pedido
    const [entrega] = await this.prisma.$transaction([
      this.prisma.entrega.create({
        data: {
          pedidoId: dto.pedidoId,
          foto: dto.foto,
          firma: dto.firma,
          ubicacion: dto.ubicacion,
        },
      }),
      this.prisma.pedido.update({
        where: { id: dto.pedidoId },
        data: { estado: EstadoPedido.ENTREGADO },
      }),
    ]);

    // Retornar la entrega con el pedido relacionado
    return this.prisma.entrega.findUnique({
      where: { id: entrega.id },
      include: { 
        pedido: { 
          include: { 
            cliente: true,
            usuario: { select: { id: true, nombre: true, rol: true } }
          } 
        } 
      },
    });
  }

  async buscarPorPedido(pedidoId: number) {
    const entrega = await this.prisma.entrega.findUnique({
      where: { pedidoId },
      include: { 
        pedido: { 
          include: { 
            cliente: true,
            usuario: { select: { id: true, nombre: true, rol: true } },
            repartidor: { select: { id: true, nombre: true, rol: true } }
          } 
        } 
      },
    });

    if (!entrega) {
      throw new NotFoundException('Este pedido aún no tiene entrega registrada');
    }

    return entrega;
  }
}