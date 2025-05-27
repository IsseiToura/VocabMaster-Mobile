# Vocabulary Master Server

## Purpose

Vocabulary Master is a web application designed to help users learn and master new vocabulary. The server component provides a robust API backend that handles user authentication, vocabulary management, and learning progress tracking. The application leverages OpenAI API to automatically generate vocabulary words tailored to the user's desired IELTS level, providing a personalized learning experience.

## Features

- User authentication and authorization
- Vocabulary management (CRUD operations)
- Learning progress tracking
- Rate limiting for API protection
- Logging system for monitoring and debugging
- MongoDB database integration
- RESTful API architecture

## Architecture

The server is built using Node.js and Express.js, following a modular architecture:

- `server.js`: Main application entry point
- `src/routes/`: API route definitions
- `src/controllers/`: Business logic handlers
- `src/models/`: Database models
- `src/middleware/`: Custom middleware functions

## API Endpoints

The server provides the following main API routes:

- `/api/auth`: Authentication endpoints (login, registration)
- `/api/words_generate`: Word generation endpoints (utilizing OpenAI API)
- `/api/your_words`: User vocabulary management endpoints
- `/api/practice`: Word practice and testing endpoints
- `/api/practice_histories`: Practice history tracking and review endpoints
- `/api/admin`: Administrative endpoints

## Dependencies

The project uses the following main dependencies:

- Express.js: Web framework
- Mongoose: MongoDB ODM
- JWT: Authentication
- Bcrypt: Password hashing
- Express Validator: Input validation
- Morgan: HTTP request logging
- Express Rate Limit: API rate limiting
- OpenAI: AI-powered features

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. For production:
   ```bash
   npm start
   ```

## Contributing

We welcome contributions to the project! Here's how you can help:

1. Fork the repository
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## Reporting Issues

If you encounter any issues or have suggestions for improvements:

1. Check the existing issues to see if your problem has already been reported
2. If not, create a new issue with:
   - A clear title and description
   - Steps to reproduce the issue
   - Expected and actual behavior
   - Screenshots if applicable
   - Your environment details (Node.js version, OS, etc.)

## License

This project is licensed under the MIT License.
