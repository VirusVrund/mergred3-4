# Module 4 – Appwrite Wrapper APIs

## Overview

This project implements Module 4 of the backend system, which focuses on building normal wrapper APIs over Appwrite services using Node.js and TypeScript.

Instead of exposing Appwrite directly, this module provides a clean API layer that interacts with Appwrite Cloud internally and exposes controlled REST endpoints.

All APIs are documented using Swagger UI for easy testing and integration.

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
