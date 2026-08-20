import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('entregas')
@UseGuards(JwtAuthGuard)
export class EntregasController {
  constructor(private entregasService: EntregasService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Rol.REPARTIDOR)
  confirmar(@Body() dto: CreateEntregaDto, @Request() req: any) {
    return this.entregasService.confirmar(dto, req.user.id);
  }

  @Get('pedido/:pedidoId')
  buscarPorPedido(@Param('pedidoId', ParseIntPipe) pedidoId: number) {
    return this.entregasService.buscarPorPedido(pedidoId);
  }
}