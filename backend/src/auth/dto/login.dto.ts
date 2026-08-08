import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;
}