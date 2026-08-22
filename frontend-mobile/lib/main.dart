import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const BodegaApp());
}

class BodegaApp extends StatelessWidget {
  const BodegaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bodega Control Pro',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const LoginScreen(),
    );
  }
}