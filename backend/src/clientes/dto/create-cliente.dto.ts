import { IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateClienteDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsOptional()
  telefono?: string;

  @IsOptional()
  direccion?: string;

  @IsEmail({}, { message: 'Debe ser un correo válido' })
  @IsOptional()
  email?: string;
}