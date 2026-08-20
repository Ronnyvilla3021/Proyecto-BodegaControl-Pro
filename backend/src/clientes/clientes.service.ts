import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateClienteDto) {
    return this.prisma.cliente.create({ data: dto });
  }

  async listar() {
    return this.prisma.cliente.findMany({
      include: { _count: { select: { pedidos: true } } },
      orderBy: { nombre: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: { pedidos: true },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return cliente;
  }

  async actualizar(id: number, dto: CreateClienteDto) {
    await this.buscarPorId(id);
    return this.prisma.cliente.update({ where: { id }, data: dto });
  }
}