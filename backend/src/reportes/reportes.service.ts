import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// 👇 CORREGIR: Usar import por defecto
import PDFDocument from 'pdfkit';
// 👇 O usar require si no funciona
// const PDFDocument = require('pdfkit');
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) {}

  private async obtenerProductos() {
    return this.prisma.producto.findMany({
      include: { categoria: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async generarCsv(res: Response) {
    const productos = await this.obtenerProductos();

    const encabezado = 'Codigo,Nombre,Categoria,Precio,Stock,Vencimiento\n';
    const filas = productos
      .map((p) =>
        [
          p.codigo,
          p.nombre,
          p.categoria.nombre,
          p.precio,
          p.stock,
          p.vencimiento ? p.vencimiento.toISOString().split('T')[0] : '',
        ].join(','),
      )
      .join('\n');

    const csv = encabezado + filas;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=productos.csv');
    res.send(csv);
  }

  async generarExcel(res: Response) {
    const productos = await this.obtenerProductos();

    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Productos');

    hoja.columns = [
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Categoría', key: 'categoria', width: 20 },
      { header: 'Precio', key: 'precio', width: 12 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Vencimiento', key: 'vencimiento', width: 15 },
    ];

    hoja.getRow(1).font = { bold: true };

    productos.forEach((p) => {
      hoja.addRow({
        codigo: p.codigo,
        nombre: p.nombre,
        categoria: p.categoria.nombre,
        precio: Number(p.precio),
        stock: p.stock,
        vencimiento: p.vencimiento ? p.vencimiento.toLocaleDateString() : '-',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=productos.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  async generarPdf(res: Response) {
    const productos = await this.obtenerProductos();

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=productos.pdf');

    doc.pipe(res);

    doc.fontSize(18).text('Reporte de Inventario — Bodega Control Pro', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generado: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown(2);

    productos.forEach((p) => {
      doc
        .fontSize(11)
        .text(
          `${p.codigo} — ${p.nombre} | Categoría: ${p.categoria.nombre} | Precio: $${p.precio} | Stock: ${p.stock}`,
        );
      doc.moveDown(0.3);
    });

    doc.end();
  }
}