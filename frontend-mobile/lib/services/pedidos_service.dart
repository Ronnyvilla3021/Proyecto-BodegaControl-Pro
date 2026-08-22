import 'dart:convert';
import 'api_service.dart';
import '../models/pedido.dart';

class PedidosService {
  static Future<List<Pedido>> misPedidos() async {
    final response = await ApiService.get('/pedidos/mis-pedidos');

    if (response.statusCode != 200) {
      throw Exception('No se pudieron cargar los pedidos');
    }

    final List data = jsonDecode(response.body);
    return data.map((json) => Pedido.fromJson(json)).toList();
  }
}