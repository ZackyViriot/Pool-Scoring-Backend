import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for all origins during development
  app.enableCors({
    origin: [
      'https://pool-scoring-frontend.vercel.app',
      'http://localhost:3000',
      'http://nckco4koo4kkg0wskow4ssog.85.31.224.91.sslip.io',
      'http://b0cwgosscocoskkggsgs804w.85.31.224.91.sslip.io',
      // Allow all sslip.io subdomains
      /^https?:\/\/.*\.sslip\.io$/,
      // Allow localhost for development
      /^https?:\/\/localhost:\d+$/
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
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

  await app.listen(8000);
  console.log('Application is running on port 8000');
}
bootstrap();