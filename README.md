# Inventory App (Next.js + GraphQL + Socket.IO)

A full-featured inventory and order management system built with:

- **Next.js** frontend
- **GraphQL** backend
- **Socket.IO** WebSocket server

## Project Structure

```bash
next-test-project/
│
├── next-prj/ # Next.js frontend app
├── graphql-server/ # GraphQL API server
├── socket-server/ # WebSocket server
└── docker-compose.yml # Multi-service container setup
```

## Getting Started with Docker

### 1. Clone the Repository

```bash
git clone 
cd next-test-project
```
### 2. Add Environment Variables

Create a .env.local file inside the next-prj folder:

```bash
JWT_SECRET=some_long_secure_random_string
NEXTAUTH_SECRET=some_long_secure_random_string
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_API=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```
### 3. Start the App

Use Docker Compose to start all services:
```bash
docker-compose up --build

Service	URL
Frontend App	http://localhost:3000
GraphQL API 	http://localhost:4000
WebSocket Server ws://localhost:3001
```

## Test Login

```bash
Username  admin
Password  admin
```