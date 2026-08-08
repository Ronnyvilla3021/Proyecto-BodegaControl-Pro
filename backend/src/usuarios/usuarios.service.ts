import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateUsuarioDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (existe) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const passwordHasheada = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        password: passwordHasheada,
        rol: dto.rol,
      },
    });

    // Nunca devuelvas el password, ni siquiera hasheado
    const { password, ...resultado } = usuario;
    return resultado;
  }

  async buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async listar() {
    return this.prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rol: true, activo: true, creadoEn: true },
    });
  }
}