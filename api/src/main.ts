import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  //Set Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  //Enable Swagger Docs
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Documentation for the Application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication-Related Endpoints')
    .addTag('users', 'User Management Endpoints')
    .addTag('products', 'Product Management Endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-JWT',
        description: 'Enter Refresh JWT Token',
        in: 'header',
      },
      'JWT-refresh',
    )
    .addServer('http://localhost:3001', 'Development Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar {display: none}
      .swagger-ui .info {margin: 50px 0}
      .swagger-ui .info .title {color: #4A90E2}
    `,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
  Logger.error('Error Starting Server...', error);
  process.exit(1);
});
