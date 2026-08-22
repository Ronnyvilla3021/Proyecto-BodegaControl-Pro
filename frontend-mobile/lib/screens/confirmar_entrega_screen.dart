import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:signature/signature.dart';
import 'package:geolocator/geolocator.dart';
import '../models/pedido.dart';
import '../services/entregas_service.dart';

class ConfirmarEntregaScreen extends StatefulWidget {
  final Pedido pedido;

  const ConfirmarEntregaScreen({super.key, required this.pedido});

  @override
  State<ConfirmarEntregaScreen> createState() => _ConfirmarEntregaScreenState();
}

class _ConfirmarEntregaScreenState extends State<ConfirmarEntregaScreen> {
  final SignatureController _firmaController = SignatureController(
    penStrokeWidth: 3,
    penColor: Colors.black,
    exportBackgroundColor: Colors.white,
  );

  File? _foto;
  Position? _ubicacion;
  bool _obteniendoUbicacion = false;
  bool _enviando = false;
  String? _error;

  @override
  void dispose() {
    _firmaController.dispose();
    super.dispose();
  }

  Future<void> _tomarFoto() async {
    final picker = ImagePicker();
    final imagen = await picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 60, // comprime la imagen para no mandar archivos gigantes como base64
    );

    if (imagen != null) {
      setState(() => _foto = File(imagen.path));
    }
  }

  Future<void> _obtenerUbicacion() async {
    setState(() => _obteniendoUbicacion = true);

    try {
      bool servicioActivo = await Geolocator.isLocationServiceEnabled();
      if (!servicioActivo) {
        throw Exception('Activa el GPS para continuar');
      }

      LocationPermission permiso = await Geolocator.checkPermission();
      if (permiso == LocationPermission.denied) {
        permiso = await Geolocator.requestPermission();
        if (permiso == LocationPermission.denied) {
          throw Exception('Permiso de ubicación denegado');
        }
      }

      if (permiso == LocationPermission.deniedForever) {
        throw Exception('Permiso de ubicación denegado permanentemente. Actívalo en ajustes.');
      }

      final posicion = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );

      setState(() {
        _ubicacion = posicion;
        _obteniendoUbicacion = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
        _obteniendoUbicacion = false;
      });
    }
  }

  Future<void> _confirmarEntrega() async {
    setState(() => _error = null);

    if (_foto == null) {
      setState(() => _error = 'Debes tomar una foto de evidencia');
      return;
    }

    if (_firmaController.isEmpty) {
      setState(() => _error = 'El cliente debe firmar para confirmar');
      return;
    }

    if (_ubicacion == null) {
      setState(() => _error = 'Debes capturar la ubicación');
      return;
    }

    setState(() => _enviando = true);

    try {
      final Uint8List? firmaBytes = await _firmaController.toPngBytes();
      final firmaBase64 = base64Encode(firmaBytes!);
      final ubicacionTexto = '${_ubicacion!.latitude},${_ubicacion!.longitude}';

      await EntregasService.confirmar(
        pedidoId: widget.pedido.id,
        foto: _foto!,
        firmaBase64: firmaBase64,
        ubicacion: ubicacionTexto,
      );

      if (!mounted) return;
      Navigator.pop(context, true); // regresa true para que la lista se refresque
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
        _enviando = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pedido #${widget.pedido.id}'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              widget.pedido.cliente.nombre,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            if (widget.pedido.cliente.direccion != null)
              Text(widget.pedido.cliente.direccion!, style: const TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),

            if (_error != null)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(_error!, style: TextStyle(color: Colors.red[700])),
              ),

            // --- Sección Foto ---
            const Text('1. Foto de evidencia', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: _tomarFoto,
              child: Container(
                height: 180,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[400]!),
                ),
                child: _foto == null
                    ? const Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.camera_alt, size: 40, color: Colors.grey),
                            SizedBox(height: 8),
                            Text('Toca para tomar una foto', style: TextStyle(color: Colors.grey)),
                          ],
                        ),
                      )
                    : ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.file(_foto!, fit: BoxFit.cover, width: double.infinity),
                      ),
              ),
            ),
            const SizedBox(height: 24),

            // --- Sección Firma ---
            const Text('2. Firma del cliente', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Container(
              height: 180,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[400]!),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Signature(
                controller: _firmaController,
                backgroundColor: Colors.white,
              ),
            ),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                onPressed: () => setState(() => _firmaController.clear()),
                icon: const Icon(Icons.refresh, size: 18),
                label: const Text('Limpiar firma'),
              ),
            ),
            const SizedBox(height: 16),

            // --- Sección Ubicación ---
            const Text('3. Ubicación', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              onPressed: _obteniendoUbicacion ? null : _obtenerUbicacion,
              icon: _obteniendoUbicacion
                  ? const SizedBox(
                      height: 16,
                      width: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : Icon(_ubicacion != null ? Icons.check_circle : Icons.my_location,
                      color: _ubicacion != null ? Colors.green : null),
              label: Text(
                _ubicacion != null
                    ? 'Ubicación capturada ✓'
                    : 'Capturar ubicación actual',
              ),
            ),
            const SizedBox(height: 32),

            ElevatedButton(
              onPressed: _enviando ? null : _confirmarEntrega,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
              child: _enviando
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Confirmar entrega', style: TextStyle(fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}