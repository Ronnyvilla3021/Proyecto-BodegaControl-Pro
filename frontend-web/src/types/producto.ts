export interface Categoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio: string; // Prisma Decimal llega como string en JSON
  stock: number;
  vencimiento: string | null;
  categoriaId: number;
  categoria: Categoria;
}

export interface CrearProductoDto {
  codigo: string;
  nombre: string;
  precio: number;
  stock?: number;
  vencimiento?: string;
  categoriaId: number;
}

export interface MovimientoDto {
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  motivo?: string;
}