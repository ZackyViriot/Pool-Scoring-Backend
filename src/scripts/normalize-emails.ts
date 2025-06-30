import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function normalizeEmails() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    console.log('Starting email normalization...');
    await usersService.normalizeEmails();
    console.log('Email normalization completed successfully!');
  } catch (error) {
    console.error('Error during email normalization:', error);
  } finally {
    await app.close();
  }
}

normalizeEmails(); 