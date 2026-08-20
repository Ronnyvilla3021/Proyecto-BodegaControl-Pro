import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reportes')
@UseGuards(JwtAuthGuard)
export class ReportesController {
  constructor(private reportesService: ReportesService) {}

  @Get('productos/csv')
  csv(@Res() res: Response) {
    return this.reportesService.generarCsv(res);
  }

  @Get('productos/excel')
  excel(@Res() res: Response) {
    return this.reportesService.generarExcel(res);
  }

  @Get('productos/pdf')
  pdf(@Res() res: Response) {
    return this.reportesService.generarPdf(res);
  }
}