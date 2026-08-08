import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('categorias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriasController {
  constructor(private categoriasService: CategoriasService) {}

  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.BODEGUERO)
  crear(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.crear(dto);
  }

  @Get()
  listar() {
    return this.categoriasService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.buscarPorId(id);
  }

  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.BODEGUERO)
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCategoriaDto) {
    return this.categoriasService.actualizar(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR)
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.eliminar(id);
  }
}