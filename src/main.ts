import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const corsOrigin = process.env.CORS_ORIGIN || 'https://pool-scoring-frontend.vercel.app';
  console.log('CORS Origin:', corsOrigin);
  
  // Enable CORS with configuration from environment
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    credentials: true
  });

  // Use global validation pipe with transformation enabled
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
}
bootstrap();