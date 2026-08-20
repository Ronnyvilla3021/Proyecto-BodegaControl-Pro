import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clientes')
@UseGuards(JwtAuthGuard)
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Post()
  crear(@Body() dto: CreateClienteDto) {
    return this.clientesService.crear(dto);
  }

  @Get()
  listar() {
    return this.clientesService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.buscarPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateClienteDto) {
    return this.clientesService.actualizar(id, dto);
  }
}