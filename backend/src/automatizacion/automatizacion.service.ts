import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipoNotificacion } from '@prisma/client';

@Injectable()
export class AutomatizacionService {
  constructor(private prisma: PrismaService) {}

  async crearNotificacion(tipo: TipoNotificacion, titulo: string, mensaje: string) {
    return this.prisma.notificacion.create({
      data: { tipo, titulo, mensaje },
    });
  }

  async listarNotificaciones(soloNoLeidas = false) {
    return this.prisma.notificacion.findMany({
      where: soloNoLeidas ? { leida: false } : undefined,
      orderBy: { creadoEn: 'desc' },
      take: 50,
    });
  }

  async marcarLeida(id: number) {
    return this.prisma.notificacion.update({
      where: { id },
      data: { leida: true },
    });
  }
}