import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('DiskIngressosERP-API');
  const app = await NestFactory.create(AppModule);

  // 1. Prefixo Global Versionado
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // 2. CORS Aberto para os frontends configurados
  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (mobile/curl) e locais
      callback(null, true);
    },
    credentials: true,
  });

  // 3. Validação Estrita de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 4. Documentação OpenAPI / Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('DiskIngressos ERP - API Enterprise')
    .setDescription('API REST corporativa do ERP Contábil e Financeiro da DiskIngressos')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 API DiskIngressos ERP em execução na porta ${port}`);
  logger.log(`📄 Documentação Swagger ativa em: http://localhost:${port}/api/docs`);
  logger.log(`🔗 Endpoint de Health: http://localhost:${port}/${apiPrefix}/health`);
}

bootstrap();
