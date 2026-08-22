import 'package:flutter/material.dart';
import '../models/usuario.dart';
import '../models/pedido.dart';
import '../services/pedidos_service.dart';
import '../services/api_service.dart';
import 'login_screen.dart';
import 'confirmar_entrega_screen.dart';

class MisPedidosScreen extends StatefulWidget {
  final Usuario usuario;

  const MisPedidosScreen({super.key, required this.usuario});

  @override
  State<MisPedidosScreen> createState() => _MisPedidosScreenState();
}

class _MisPedidosScreenState extends State<MisPedidosScreen> {
  List<Pedido> _pedidos = [];
  bool _cargando = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _cargarPedidos();
  }

  Future<void> _cargarPedidos() async {
    setState(() {
      _cargando = true;
      _error = null;
    });

    try {
      final pedidos = await PedidosService.misPedidos();
      setState(() {
        _pedidos = pedidos;
        _cargando = false;
      });
    } catch (e) {
      setState(() {
        _error = 'No se pudieron cargar los pedidos';
        _cargando = false;
      });
    }
  }

  Future<void> _cerrarSesion() async {
    await ApiService.cerrarSesion();
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Mis Entregas'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _cerrarSesion,
            tooltip: 'Cerrar sesión',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _cargarPedidos,
        child: _cargando
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text(_error!))
                : _pedidos.isEmpty
                    ? ListView(
                        children: const [
                          SizedBox(height: 100),
                          Icon(Icons.check_circle_outline, size: 64, color: Colors.grey),
                          SizedBox(height: 16),
                          Center(
                            child: Text(
                              'No tienes entregas pendientes',
                              style: TextStyle(color: Colors.grey),
                            ),
                          ),
                        ],
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _pedidos.length,
                        itemBuilder: (context, index) {
                          final pedido = _pedidos[index];
                          return _TarjetaPedido(
                            pedido: pedido,
                            onConfirmar: () async {
                              final resultado = await Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => ConfirmarEntregaScreen(pedido: pedido),
                                ),
                              );
                              if (resultado == true) {
                                _cargarPedidos(); // refresca la lista si se confirmó una entrega
                              }
                            },
                          );
                        },
                      ),
      ),
    );
  }
}

class _TarjetaPedido extends StatelessWidget {
  final Pedido pedido;
  final VoidCallback onConfirmar;

  const _TarjetaPedido({required this.pedido, required this.onConfirmar});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Pedido #${pedido.id}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  '\$${pedido.total}',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.person, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(pedido.cliente.nombre),
              ],
            ),
            if (pedido.cliente.direccion != null) ...[
              const SizedBox(height: 4),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.location_on, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Expanded(child: Text(pedido.cliente.direccion!)),
                ],
              ),
            ],
            const SizedBox(height: 12),
            const Divider(),
            ...pedido.detalles.map(
              (d) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Text(
                  '${d.cantidad}x ${d.nombreProducto}',
                  style: const TextStyle(color: Colors.grey),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onConfirmar,
                icon: const Icon(Icons.check_circle),
                label: const Text('Confirmar entrega'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}