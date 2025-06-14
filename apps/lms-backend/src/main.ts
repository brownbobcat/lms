/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://lms-five-navy.vercel.app', // Your new Vercel URL
      // 'https://lms-tawny-seven.vercel.app',  // Your old Vercel URL
    ],
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
