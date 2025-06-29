import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  let app;
  
  // Check if we're in production and SSL certificates exist
  const sslKeyPath = process.env.SSL_KEY_PATH || '/etc/ssl/private/ssl-cert-snakeoil.key';
  const sslCertPath = process.env.SSL_CERT_PATH || '/etc/ssl/certs/ssl-cert-snakeoil.pem';
  
  if (process.env.NODE_ENV === 'production' && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    const httpsOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    app = await NestFactory.create(AppModule);
  }
  
  // Enable CORS
  app.enableCors({
    origin: [
      'https://poolscoring.com',
      'https://www.poolscoring.com',
      'http://localhost:3000', // Keep localhost for development
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
 
  // Add a global middleware to log all requests
  app.use((req, res, next) => {
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`,
    );
    next();
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

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on port ${port} with ${process.env.NODE_ENV === 'production' ? 'HTTPS' : 'HTTP'}`);
}
bootstrap();