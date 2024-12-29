# Pool Scoring Backend

A NestJS backend service for the Pool Scoring application, providing user authentication, game state management, and data persistence using MongoDB.

## Features

- User authentication with JWT
- MongoDB integration
- RESTful API endpoints
- Payment processing integration
- Secure password handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add:
```
MONGODB_URI=mongodb://localhost:27017/pool-scoring
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
STRIPE_SECRET_KEY=your-stripe-secret-key
```

3. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`.

## Available Scripts

- `npm run start:dev` - Runs the app in development mode
- `npm run build` - Compiles the TypeScript code
- `npm run start:prod` - Runs the compiled code in production
- `npm run test` - Runs the test suite
- `npm run lint` - Lints the codebase

## Project Structure

```
src/
├── auth/          # Authentication module
├── users/         # User management module
├── app.module.ts  # Main application module
└── main.ts        # Application entry point
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request # Pool-Scoring-Backend
