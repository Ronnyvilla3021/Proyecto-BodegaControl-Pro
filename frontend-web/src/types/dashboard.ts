export interface ProductoStockBajo {
  id: number;
  codigo: string;
  nombre: string;
  stock: number;
  categoria: { nombre: string };
}

export interface ProductoVendido {
  producto: { id: number; nombre: string; codigo: string } | undefined;
  cantidadVendida: number | null;
}

export interface ResumenDashboard {
  timestamp: string;
  stockBajo: ProductoStockBajo[];
  pedidosHoy: number;
  entregasHoy: number;
  productosVendidos: ProductoVendido[];
}