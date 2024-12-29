import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://pool-scoring-frontend.vercel.app',
      'https://pool-scoring.vercel.app',
      'https://pool-scoring-backend-production.up.railway.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: false
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3001);
}
bootstrap(); 