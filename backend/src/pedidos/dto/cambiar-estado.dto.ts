import { IsEnum } from 'class-validator';
import { EstadoPedido } from '@prisma/client';

export class CambiarEstadoDto {
  @IsEnum(EstadoPedido, { message: 'Estado inválido' })
  estado!: EstadoPedido;
}