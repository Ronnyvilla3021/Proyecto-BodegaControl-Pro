import { Module } from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { EntregasController } from './entregas.controller';

@Module({
  providers: [EntregasService],
  controllers: [EntregasController]
})
export class EntregasModule {}
