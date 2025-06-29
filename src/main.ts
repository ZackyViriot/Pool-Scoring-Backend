import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with comprehensive error handling
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://b0cwgosscocoskkggsgs804w.85.31.224.91.sslip.io',
    'http://nckco4koo4kkg0wskow4ssog.85.31.224.91.sslip.io',
    'https://b0cwgosscocoskkggsgs804w.85.31.224.91.sslip.io',
    'https://nckco4koo4kkg0wskow4ssog.85.31.224.91.sslip.io'
  ];

  app.enableCors({
    origin: function (origin, callback) {
      console.log('=== CORS REQUEST DEBUG ===');
      console.log('Request origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      console.log('Request method:', 'N/A (CORS preflight)');
      console.log('Request headers:', 'N/A (CORS preflight)');
      console.log('========================');

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('✅ Allowing request with no origin');
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log('✅ Origin allowed:', origin);
        return callback(null, true);
      } else {
        console.log('❌ Origin NOT allowed:', origin);
        console.log('❌ This origin is not in the allowed list');
        return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
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
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Add a global middleware to log all requests with detailed information
  app.use((req, res, next) => {
    console.log('\n=== REQUEST DEBUG ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Origin:', req.headers.origin);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Authorization:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Accept:', req.headers.accept);
    console.log('Referer:', req.headers.referer);
    console.log('Host:', req.headers.host);
    console.log('All Headers:', JSON.stringify(req.headers, null, 2));
    console.log('=====================\n');

    // Add response logging
    const originalSend = res.send;
    res.send = function(data) {
      console.log('\n=== RESPONSE DEBUG ===');
      console.log('Status:', res.statusCode);
      console.log('Headers:', JSON.stringify(res.getHeaders(), null, 2));
      console.log('Body length:', data ? data.length : 0);
      console.log('=====================\n');
      return originalSend.call(this, data);
    };

    next();
  });

  // Add error handling middleware
  app.use((error, req, res, next) => {
    console.error('\n=== ERROR DEBUG ===');
    console.error('Error occurred:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request method:', req.method);
    console.error('Request URL:', req.url);
    console.error('Request origin:', req.headers.origin);
    console.error('===================\n');

    if (error.message.includes('CORS')) {
      res.status(403).json({
        error: 'CORS Error',
        message: error.message,
        allowedOrigins: allowedOrigins,
        requestOrigin: req.headers.origin
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
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
  console.log('🚀 Application is running on port 8000');
  console.log('🔧 CORS enabled for origins:', allowedOrigins);
  console.log('🔐 Credentials enabled: true');
  console.log('📝 Detailed logging enabled');
}
bootstrap();
