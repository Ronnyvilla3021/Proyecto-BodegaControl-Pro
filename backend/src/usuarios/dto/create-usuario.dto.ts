import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Rol } from '@prisma/client';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email!: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsEnum(Rol, { message: 'Rol inválido' })
  rol!: Rol;
}