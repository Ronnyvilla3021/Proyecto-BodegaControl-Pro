import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pedidos')
@UseGuards(JwtAuthGuard)
export class PedidosController {
  constructor(private pedidosService: PedidosService) {}

  @Post()
  crear(@Body() dto: CreatePedidoDto, @Request() req: any) {
    return this.pedidosService.crear(dto, req.user.id);
  }

  @Get()
  listar() {
    return this.pedidosService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.buscarPorId(id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoDto,
    @Request() req: any,
  ) {
    return this.pedidosService.cambiarEstado(id, dto.estado, req.user.id);
  }
}