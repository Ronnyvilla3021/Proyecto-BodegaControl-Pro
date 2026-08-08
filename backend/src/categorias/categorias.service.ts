import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateCategoriaDto) {
    const existe = await this.prisma.categoria.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    return this.prisma.categoria.create({ data: dto });
  }

  async listar() {
    return this.prisma.categoria.findMany({
      include: { _count: { select: { productos: true } } },
    });
  }

  async buscarPorId(id: number) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }

  async actualizar(id: number, dto: CreateCategoriaDto) {
    await this.buscarPorId(id); // valida que exista, lanza 404 si no

    return this.prisma.categoria.update({
      where: { id },
      data: dto,
    });
  }

  async eliminar(id: number) {
    await this.buscarPorId(id);

    return this.prisma.categoria.delete({ where: { id } });
  }
}