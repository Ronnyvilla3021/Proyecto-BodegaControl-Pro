import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('EMAIL_USER'),
        pass: this.config.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async enviar(destinatario: string, asunto: string, mensajeHtml: string) {
    try {
      await this.transporter.sendMail({
        from: `"Bodega Control Pro" <${this.config.get('EMAIL_USER')}>`,
        to: destinatario,
        subject: asunto,
        html: mensajeHtml,
      });
      this.logger.log(`Correo enviado a ${destinatario}: ${asunto}`);
    } catch (error) {
      // 👇 Corregido: usar 'any' o verificar el tipo
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error enviando correo: ${errorMessage}`);
    }
  }
}