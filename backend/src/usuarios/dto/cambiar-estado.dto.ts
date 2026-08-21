import { IsBoolean } from 'class-validator';

export class CambiarEstadoUsuarioDto {
  @IsBoolean({ message: 'El estado debe ser verdadero o falso' })
  activo!: boolean;
}