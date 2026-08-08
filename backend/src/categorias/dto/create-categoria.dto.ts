import { IsNotEmpty } from 'class-validator';

export class CreateCategoriaDto {
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  nombre!: string;
}