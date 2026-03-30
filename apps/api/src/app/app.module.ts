import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { OrganizacoesModule } from '../organizacoes/organizacoes.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { ProcessosModule } from '../processos/processos.module.js';
import { AvaliacoesModule } from '../avaliacoes/avaliacoes.module.js';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    OrganizacoesModule,
    UsuariosModule,
    ProcessosModule,
    AvaliacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
