import 'dart:convert';
import 'api_service.dart';
import '../models/usuario.dart';

class AuthService {
  static Future<Usuario> login(String email, String password) async {
    final response = await ApiService.post('/auth/login', {
      'email': email,
      'password': password,
    });

    if (response.statusCode != 200 && response.statusCode != 201) {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Error al iniciar sesión');
    }

    final data = jsonDecode(response.body);
    await ApiService.guardarToken(data['access_token']);
    return Usuario.fromJson(data['usuario']);
  }
}