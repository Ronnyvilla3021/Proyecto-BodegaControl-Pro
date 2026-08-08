import { IsNotEmpty, IsNumber, IsInt, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El código es obligatorio' })
  codigo!: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio!: number;

  @IsInt({ message: 'El stock inicial debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @IsOptional()
  stock?: number;

  @IsDateString({}, { message: 'La fecha de vencimiento no es válida' })
  @IsOptional()
  vencimiento?: string;

  @IsInt({ message: 'La categoría es obligatoria' })
  categoriaId!: number;
}