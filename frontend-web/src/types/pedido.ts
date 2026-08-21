export interface Cliente {
  id: number;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  email: string | null;
}

export interface DetallePedido {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: string;
  subtotal: string;
  producto: { nombre: string; codigo: string };
}

export type EstadoPedido = 'PENDIENTE' | 'EMPACADO' | 'EN_RUTA' | 'ENTREGADO';

export interface Pedido {
  id: number;
  clienteId: number;
  cliente: Cliente;
  estado: EstadoPedido;
  total: string;
  detalles: DetallePedido[];
  creadoEn: string;
}

export interface ItemPedido {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoDto {
  clienteId: number;
  items: ItemPedido[];
}