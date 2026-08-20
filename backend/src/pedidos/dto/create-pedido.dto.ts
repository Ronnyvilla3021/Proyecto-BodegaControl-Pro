import { IsInt, IsArray, ValidateNested, ArrayMinSize, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ItemPedidoDto {
  @IsInt()
  productoId!: number;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad!: number;
}

export class CreatePedidoDto {
  @IsInt({ message: 'El cliente es obligatorio' })
  clienteId!: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'El pedido debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  items!: ItemPedidoDto[];
}