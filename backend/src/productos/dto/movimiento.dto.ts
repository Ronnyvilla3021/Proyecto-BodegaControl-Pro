import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TipoMovimiento } from '@prisma/client';

export class MovimientoDto {
  @IsEnum(TipoMovimiento, { message: 'El tipo debe ser ENTRADA o SALIDA' })
  tipo!: TipoMovimiento;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad!: number;

  @IsOptional()
  motivo?: string;
}