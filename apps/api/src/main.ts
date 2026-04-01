import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app/app.module';
import { runSeedIfEmpty } from './database/seed-bootstrap.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );

  // Seed automatico: roda apenas se o banco estiver vazio
  try {
    const dataSource = app.get(DataSource);
    await runSeedIfEmpty(dataSource);
  } catch (err) {
    Logger.warn('Seed ignorado ou falhou: ' + (err as Error).message, 'SeedBootstrap');
  }
}

bootstrap();
