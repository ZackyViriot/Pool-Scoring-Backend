import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with specific origins for production and development
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://nckco4koo4kkg0wskow4ssog.85.31.224.91.sslip.io',
    'https://nckco4koo4kkg0wskow4ssog.85.31.224.91.sslip.io',
    'http://b0cwgosscocoskkggsgs804w.85.31.224.91.sslip.io',
    'https://b0cwgosscocoskkggsgs804w.85.31.224.91.sslip.io',
    // Allow all subdomains of sslip.io for flexibility
    /^https?:\/\/.*\.85\.31\.224\.91\.sslip\.io$/,
    // Add any other frontend domains you need
  ];

  app.enableCors({
    origin: function (origin, callback) {
      console.log('CORS request from origin:', origin);
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('Allowing request with no origin');
        return callback(null, true);
      }
      
      // Check if origin matches any of the allowed origins (including regex patterns)
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return allowedOrigin === origin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        console.log('Origin allowed:', origin);
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',   
      'Accept', 
      'Authorization', 
      'X-Requested-With',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Add a global middleware to log all requests
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
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

  await app.listen(8000);
  console.log('Application is running on port 8000');
  console.log('CORS enabled for origins:', allowedOrigins);
}
bootstrap();