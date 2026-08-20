import { Controller, Get, Post, Patch, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { AutomatizacionService } from './automatizacion.service';
import { SchedulerService } from './scheduler/scheduler.service'; // 👈 Ruta corregida
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('automatizacion')
@UseGuards(JwtAuthGuard)
export class AutomatizacionController {
  constructor(
    private automatizacionService: AutomatizacionService,
    private schedulerService: SchedulerService,
  ) {}

  @Get('notificaciones')
  listar(@Query('noLeidas') noLeidas?: string) {
    return this.automatizacionService.listarNotificaciones(noLeidas === 'true');
  }

  @Patch('notificaciones/:id/leida')
  marcarLeida(@Param('id', ParseIntPipe) id: number) {
    return this.automatizacionService.marcarLeida(id);
  }

  @Post('probar/stock-bajo')
  @UseGuards(RolesGuard)
  @Roles(Rol.ADMINISTRADOR)
  probarStockBajo() {
    return this.schedulerService.revisarStockBajo();
  }
}