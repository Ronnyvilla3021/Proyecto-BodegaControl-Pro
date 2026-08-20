import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { EstadoPedido } from '@prisma/client';

@Injectable()
export class EntregasService {
  constructor(private prisma: PrismaService) {}

  async confirmar(dto: CreateEntregaDto, repartidorId: number) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id: dto.pedidoId } });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (pedido.repartidorId !== repartidorId) {
      throw new ForbiddenException('Este pedido no está asignado a ti');
    }

    if (pedido.estado !== EstadoPedido.EN_RUTA) {
      throw new BadRequestException('Solo se puede confirmar entrega de un pedido en ruta');
    }

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

    return entrega;
  }

  async buscarPorPedido(pedidoId: number) {
    const entrega = await this.prisma.entrega.findUnique({
      where: { pedidoId },
      include: { pedido: { include: { cliente: true } } },
    });

    if (!entrega) {
      throw new NotFoundException('Este pedido aún no tiene entrega registrada');
    }

    return entrega;
  }
}