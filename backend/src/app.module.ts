import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsuariosModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
