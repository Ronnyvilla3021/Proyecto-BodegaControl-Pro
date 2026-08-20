import { Module } from '@nestjs/common';
import { AutomatizacionController } from './automatizacion.controller';
import { AutomatizacionService } from './automatizacion.service';
import { SchedulerService } from './scheduler/scheduler.service'; // 👈 Ruta corregida
import { EmailService } from './email/email.service'; // 👈 Ruta corregida

@Module({
  controllers: [AutomatizacionController],
  providers: [AutomatizacionService, SchedulerService, EmailService],
})
export class AutomatizacionModule {}