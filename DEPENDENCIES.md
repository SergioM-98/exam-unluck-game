# Project Dependencies

## Overview
This project consists of two main components:
- **Server**: Node.js/Express backend with authentication and game logic
- **Client**: React frontend with Bootstrap UI

---

## Server Dependencies (Production)

### Core Framework
- **express@4.21.2** - Web application framework for Node.js
- **express-session@1.18.1** - Session middleware for Express
- **express-validator@7.2.1** - Middleware for input validation

### Authentication
- **passport@0.7.0** - Authentication middleware for Node.js
- **passport-local@1.0.0** - Local username and password authentication strategy

### Database
- **sqlite3@5.1.7** - SQLite3 bindings for Node.js

### Utilities
- **cors@2.8.5** - CORS (Cross-Origin Resource Sharing) middleware
- **dayjs@1.11.13** - Lightweight date manipulation library
- **morgan@1.10.0** - HTTP request logger middleware
- **bootstrap@5.3.6** - CSS framework (for server-side components if needed)

---

## Client Dependencies

### Core React Ecosystem
- **react@19.1.0** - JavaScript library for building user interfaces
- **react-dom@19.1.0** - React DOM rendering
- **react-router@7.6.2** - Declarative routing for React applications

### UI Framework
- **bootstrap@5.3.6** - CSS framework for responsive design
- **react-bootstrap@2.10.10** - Bootstrap components for React
- **bootstrap-icons@1.13.1** - Official Bootstrap icon library

### Utilities
- **dayjs@1.11.13** - Date manipulation library (shared with server)

### Development Dependencies
- **vite@6.3.5** - Build tool and development server
- **@vitejs/plugin-react@4.5.2** - Vite plugin for React support
- **eslint@9.28.0** - JavaScript linting utility
- **@eslint/js@9.28.0** - ESLint JavaScript language support
- **eslint-plugin-react-hooks@5.2.0** - ESLint rules for React Hooks
- **eslint-plugin-react-refresh@0.4.20** - ESLint plugin for React refresh
- **globals@16.2.0** - Global variables for various environments
- **@types/react@19.1.8** - TypeScript definitions for React
- **@types/react-dom@19.1.6** - TypeScript definitions for React DOM

---

## Dependency Analysis

### Key Features Enabled

**Server Side:**
- RESTful API with Express.js
- Session-based authentication with Passport.js
- SQLite database integration
- Input validation and sanitization
- CORS support for frontend communication
- Request logging for debugging

**Client Side:**
- Modern React 19 with latest features
- Responsive UI with Bootstrap 5
- Client-side routing with React Router 7
- Development tools with Vite
- Code quality with ESLint
- TypeScript support for better development experience

### Security Considerations
- `express-validator` provides input sanitization
- `passport` handles secure authentication
- `express-session` manages user sessions securely
- `cors` configured to restrict cross-origin requests

### Performance Optimizations
- `dayjs` is a lightweight alternative to Moment.js
- `vite` provides fast development builds and optimized production builds
- Bootstrap components are tree-shakeable for smaller bundle sizes

---

## Installation Instructions

### Server Setup
```bash
cd server
npm install
```

### Client Setup
```bash
cd client
npm install
```

### Development
```bash
# Start server (from server directory)
npm start

# Start client (from client directory)
npm run dev
```

---

## Compatibility

- **Node.js**: Requires Node.js 18+ for optimal performance
- **Browsers**: Modern browsers supporting ES2022+
- **React**: Built with React 19 (latest stable)
- **Bootstrap**: Version 5.3.6 with full component compatibility

---

*Generated on: July 3, 2025*  
*Project: Gioco della Sfortuna*  
*Student: s346253 Maestrale Sergio*
