import { Test, TestingModule } from '@nestjs/testing';
import { AutomatizacionController } from './automatizacion.controller';

describe('AutomatizacionController', () => {
  let controller: AutomatizacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutomatizacionController],
    }).compile();

    controller = module.get<AutomatizacionController>(AutomatizacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
