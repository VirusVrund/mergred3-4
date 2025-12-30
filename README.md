# Module 4 – Appwrite Wrapper APIs

## Overview


Module 4 is responsible for exposing **clean, controlled REST APIs** that act as a wrapper over **Appwrite services**.

Instead of allowing direct access to Appwrite from clients or other services, this module provides an abstraction layer that:
- Encapsulates Appwrite SDK usage
- Standardizes API responses
- Handles validation and error mapping
- Documents APIs using Swagger (OpenAPI)

> ⚠️ This module **does NOT** handle authentication, rate limiting, or authorization logic.  
Those concerns are enforced by upstream modules in the system.

---
### Request Flow
```
Client
↓
Module 1 – API Gateway
(Rate Limiting, IP & API Key)
↓
Module 2 – API Key Validation
(Redis + DB Lookup)
↓
Module 3 – Authorization
(Role-based Access Control)
↓
Module 4 – Appwrite Wrapper APIs
↓
Appwrite Cloud Services
```
---
## What is Completed

###  Appwrite Integration
- Connected to Appwrite Cloud
- Configured Appwrite server SDK (`node-appwrite`)
- Secure usage via API Key (server-side only)

###  Database Wrapper APIs
Wrapper APIs built over Appwrite Database (Tables/Collections):
- Create a project
- Fetch all projects
- Fetch a project by ID

These APIs act as a controlled interface between the system and Appwrite.

###  Swagger Documentation
- All APIs are documented using Swagger (OpenAPI 3.0)
- Interactive API testing available through browser

###  Clean Architecture
- Modular folder structure
- Separation of routes, controllers, config, and docs
- Type-safe code using TypeScript

---

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Appwrite Cloud
- node-appwrite (Server SDK)
- Swagger UI
- swagger-jsdoc

---

## Project Structure
```
module4-appwrite/
│
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # Server entry point
│
│   ├── config/
│   │   └── appwrite.ts       # Appwrite client configuration
│
│   ├── routes/
│   │   └── database.routes.ts
│
│   ├── controllers/
│   │   └── database.controller.ts
│
│   ├── docs/
│   │   └── swagger.ts        # Swagger configuration
│
│   └── types/
│       └── index.d.ts
│
├── .env                      # Environment variables (not committed)
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## API Endpoints

### Database APIs

| Method | Endpoint                      | Description           |
|--------|-------------------------------|-----------------------|
| POST   | `/api/database/projects`      | Create a new project  |
| GET    | `/api/database/projects`      | Get all projects      |
| GET    | `/api/database/projects/:id`  | Get project by ID     |

---

# Input Validation (Zod)

All incoming requests are validated at the API boundary using Zod. Each API endpoint defines a dedicated validation schema for request bodies and route parameters. Invalid or malformed requests are rejected before any business logic or Appwrite service is executed. Validation logic is centralized and reusable across controllers. TypeScript types are inferred directly from Zod schemas to ensure runtime validation and compile-time type safety remain in sync.

This guarantees that only well-formed, type-safe data is processed by the system.

--- 

# Centralized Error Handling

Module 4 uses a centralized error handling strategy to prevent leaking Appwrite-specific or internal errors to API consumers. Custom HttpError abstractions represent domain-level errors within the application. Errors originating from the Appwrite SDK are mapped to clean HTTP errors before being returned to clients. Controllers do not format error responses directly and instead throw domain errors. A global Express error handler captures all errors and formats API responses consistently.

This approach keeps controllers clean, improves maintainability, and ensures stable and predictable error responses across the system.

---

## Swagger Documentation

Swagger UI is available at:
```
http://localhost:4000/api-docs
```

All endpoints can be tested directly from the browser.

---

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:
```env
PORT=4000
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
APPWRITE_API_KEY=YOUR_API_KEY
REDIS_URL=redis://localhost:6379
KEY_SECRET=super-secret-salt
DATABASE_ID=YOUR_DATABASE_ID
COLLECTION_ID=YOUR_COLLECTION_ID
```

### 3. Start Development Server
```bash
npm run dev
```

Server will start at:
```
http://localhost:4000
```

---

## Health Check

Test if server is running:
```
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Module 4 API running"
}
```

---

## Purpose of Module 4

Module 4 is responsible for:

- Wrapping Appwrite services behind custom APIs
- Preventing direct access to Appwrite from clients
- Providing clean, documented, and reusable backend APIs
- Supporting integration with other modules like rate limiting, API key validation, and authorization

---

## Future Enhancements (Planned)

- Storage wrapper APIs (file uploads)
- User management APIs
- Request validation
- Enhanced error handling

---

## Author

**Dev Desai**  
