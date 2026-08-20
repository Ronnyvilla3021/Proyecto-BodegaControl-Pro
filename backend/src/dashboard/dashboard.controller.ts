import { Controller, Get, Sse, UseGuards } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  // Endpoint normal: una sola foto del estado actual
  @Get('resumen')
  resumen() {
    return this.dashboardService.obtenerResumen();
  }

  // Endpoint SSE: empuja el resumen actualizado cada 5 segundos
  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return interval(5000).pipe(
      switchMap(() => this.dashboardService.obtenerResumen()),
      map((data) => ({ data }) as MessageEvent),
    );
  }
}