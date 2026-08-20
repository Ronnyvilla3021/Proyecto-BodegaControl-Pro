import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateEntregaDto {
  @IsInt({ message: 'El pedido es obligatorio' })
  pedidoId!: number;

  @IsNotEmpty({ message: 'La foto es obligatoria' })
  foto!: string; // por ahora, base64 o URL. Lo conectamos a subida real de archivos cuando integremos Flutter

  @IsNotEmpty({ message: 'La firma es obligatoria' })
  firma!: string; // mismo caso, base64 del trazo de firma

  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  ubicacion!: string; // "lat,lng" como string simple por ahora
}