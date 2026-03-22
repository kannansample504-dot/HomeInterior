import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.DJANGO_CORS_ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
    ],
    credentials: true,
  });

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Home Interior API')
    .setDescription('NestJS Auth & Estimation Engine')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.NEST_PORT || 3001;
  await app.listen(port);
  console.log(`NestJS running on port ${port}`);
}
bootstrap();
