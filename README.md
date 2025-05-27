# VocabMaster

A full-stack vocabulary learning application that helps users master new words through an interactive and engaging interface. By leveraging OpenAI API, users can learn English vocabulary tailored to their IELTS proficiency level, ensuring personalized and effective learning experiences.

## Project Structure

The project is divided into two main directories:

### Mobile Application (`/mobile`)

A React Native mobile application that provides an intuitive user interface for vocabulary learning.

```
mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── constants/      # Application constants and configuration
│   ├── contexts/       # React Context providers
│   ├── layouts/        # Layout components and templates
│   ├── pages/         # Screen components
│   ├── services/      # API and external service integrations
│   └── App.js         # Main application component
├── assets/            # Static assets (images, fonts, etc.)
└── package.json       # Project dependencies and scripts
```

### Server Application (`/server`)

A Node.js backend server that handles API requests and manages the application's business logic.

```
server/
├── src/
│   ├── controllers/   # Request handlers and business logic
│   ├── middlewares/   # Express middleware functions
│   ├── models/        # Database models and schemas
│   ├── routes/        # API route definitions
│   └── utils/         # Utility functions and helpers
├── server.js          # Main server entry point
└── package.json       # Project dependencies and scripts
```

## Features

- Personalized vocabulary learning based on IELTS proficiency levels
- Interactive learning interface
- OpenAI-powered word explanations and examples
- Progress tracking and statistics
- User authentication and profile management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React Native development environment setup
- MongoDB database

### Installation

1. Clone the repository
2. Install dependencies for both mobile and server applications:

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install mobile dependencies
   cd ../mobile
   npm install
   ```

3. Set up environment variables for both applications
4. Start the server:

   ```bash
   cd server
   npm start
   ```

5. Start the mobile application:
   ```bash
   cd mobile
   npx expo start
   ```

## API Documentation

API documentation is available in the `API-collection.json` file in the server directory. This file contains detailed information about all available endpoints, request/response formats, and authentication requirements.

## License

This project is licensed under the terms specified in the LICENSE file.
