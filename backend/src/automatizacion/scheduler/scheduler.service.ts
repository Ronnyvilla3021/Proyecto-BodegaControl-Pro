import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { AutomatizacionService } from '../automatizacion.service';
import { TipoNotificacion } from '@prisma/client';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly correoAdmin = 'admin@bodega.com';

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private automatizacionService: AutomatizacionService,
  ) {}

  @Cron('0 8 * * *')
  async revisarStockBajo() {
    this.logger.log('Ejecutando revisión de stock bajo...');

    const productos = await this.prisma.producto.findMany({
      where: { stock: { lte: 10 } },
    });

    if (productos.length === 0) return;

    const listaHtml = productos.map((p) => `<li>${p.nombre} — stock: ${p.stock}</li>`).join('');
    const mensaje = `Hay ${productos.length} producto(s) con stock bajo:<ul>${listaHtml}</ul>`;

    await this.automatizacionService.crearNotificacion(
      TipoNotificacion.STOCK_BAJO,
      'Productos con stock bajo',
      mensaje,
    );

    await this.emailService.enviar(this.correoAdmin, '⚠️ Aviso: Stock bajo', mensaje);
  }

  @Cron('15 8 * * *')
  async revisarProductosVencidos() {
    this.logger.log('Ejecutando revisión de productos vencidos...');

    const hoy = new Date();
    const enSieteDias = new Date();
    enSieteDias.setDate(hoy.getDate() + 7);

    const productos = await this.prisma.producto.findMany({
      where: { vencimiento: { lte: enSieteDias, gte: hoy } },
    });

    if (productos.length === 0) return;

    const listaHtml = productos
      .map((p) => `<li>${p.nombre} — vence: ${p.vencimiento?.toLocaleDateString()}</li>`)
      .join('');
    const mensaje = `Hay ${productos.length} producto(s) por vencer en los próximos 7 días:<ul>${listaHtml}</ul>`;

    await this.automatizacionService.crearNotificacion(
      TipoNotificacion.PRODUCTO_VENCIDO,
      'Productos por vencer',
      mensaje,
    );

    await this.emailService.enviar(this.correoAdmin, '⏰ Aviso: Productos por vencer', mensaje);
  }

  @Cron('0 7 * * 1')
  async resumenSemanal() {
    this.logger.log('Generando resumen semanal...');

    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);

    const [pedidosSemana, entregasSemana] = await Promise.all([
      this.prisma.pedido.count({ where: { creadoEn: { gte: haceUnaSemana } } }),
      this.prisma.entrega.count({ where: { fecha: { gte: haceUnaSemana } } }),
    ]);

    const mensaje = `Resumen de la semana: ${pedidosSemana} pedidos creados, ${entregasSemana} entregas completadas.`;

    await this.automatizacionService.crearNotificacion(
      TipoNotificacion.RESUMEN_SEMANAL,
      'Resumen semanal',
      mensaje,
    );

    await this.emailService.enviar(this.correoAdmin, '📊 Resumen semanal', mensaje);
  }
}