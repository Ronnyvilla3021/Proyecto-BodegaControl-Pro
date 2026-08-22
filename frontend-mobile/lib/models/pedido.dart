class Cliente {
  final int id;
  final String nombre;
  final String? telefono;
  final String? direccion;

  Cliente({required this.id, required this.nombre, this.telefono, this.direccion});

  factory Cliente.fromJson(Map<String, dynamic> json) {
    return Cliente(
      id: json['id'],
      nombre: json['nombre'],
      telefono: json['telefono'],
      direccion: json['direccion'],
    );
  }
}

class DetallePedido {
  final int cantidad;
  final String subtotal;
  final String nombreProducto;

  DetallePedido({
    required this.cantidad,
    required this.subtotal,
    required this.nombreProducto,
  });

  factory DetallePedido.fromJson(Map<String, dynamic> json) {
    return DetallePedido(
      cantidad: json['cantidad'],
      subtotal: json['subtotal'],
      nombreProducto: json['producto']['nombre'],
    );
  }
}

class Pedido {
  final int id;
  final Cliente cliente;
  final String estado;
  final String total;
  final List<DetallePedido> detalles;

  Pedido({
    required this.id,
    required this.cliente,
    required this.estado,
    required this.total,
    required this.detalles,
  });

  factory Pedido.fromJson(Map<String, dynamic> json) {
    return Pedido(
      id: json['id'],
      cliente: Cliente.fromJson(json['cliente']),
      estado: json['estado'],
      total: json['total'],
      detalles: (json['detalles'] as List)
          .map((d) => DetallePedido.fromJson(d))
          .toList(),
    );
  }
}