import { IsInt } from 'class-validator';

export class AsignarRepartidorDto {
  @IsInt({ message: 'El repartidor es obligatorio' })
  repartidorId!: number;
}