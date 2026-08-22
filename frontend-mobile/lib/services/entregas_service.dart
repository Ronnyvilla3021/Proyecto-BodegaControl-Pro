import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'api_service.dart';

class EntregasService {
  static Future<void> confirmar({
    required int pedidoId,
    required File foto,
    required String firmaBase64,
    required String ubicacion,
  }) async {
    // Convertimos la foto a base64 para mandarla como texto dentro del JSON,
    // igual que hicimos con foto/firma simuladas al probar desde Thunder Client.
    final bytesFoto = await foto.readAsBytes();
    final fotoBase64 = base64Encode(bytesFoto);

    final response = await ApiService.post('/entregas', {
      'pedidoId': pedidoId,
      'foto': fotoBase64,
      'firma': firmaBase64,
      'ubicacion': ubicacion,
    });

    if (response.statusCode != 200 && response.statusCode != 201) {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Error al confirmar la entrega');
    }
  }
}