import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { MovimientoDto } from './dto/movimiento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.BODEGUERO)
  crear(@Body() dto: CreateProductoDto) {
    return this.productosService.crear(dto);
  }

  @Get()
  listar() {
    return this.productosService.listar();
  }

  @Get('stock-bajo')
  stockBajo(@Query('umbral') umbral?: string) {
    return this.productosService.productosStockBajo(umbral ? Number(umbral) : undefined);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.buscarPorId(id);
  }

  @Get(':id/kardex')
  kardex(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.kardex(id);
  }

  @Post(':id/movimiento')
  @Roles(Rol.ADMINISTRADOR, Rol.BODEGUERO)
  registrarMovimiento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MovimientoDto,
    @Request() req: any,
  ) {
    return this.productosService.registrarMovimiento(id, dto, req.user.id);
  }
}