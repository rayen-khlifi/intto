# InterimAI Backend (NestJS)

Academic backend for **InterimAI**: an intelligent recruitment platform (ATS + mock RAG matching).

## Features
- NestJS + TypeScript, modular architecture
- MongoDB (Mongoose)
- JWT Auth + Roles (JOB_SEEKER / COMPANY / ADMIN)
- CV upload (text simulation) + skill extraction
- Jobs CRUD (company only)
- Applications + matching score
- WebSocket notifications (Socket.IO)
- Swagger docs at `/docs`
- Rate limiting via Throttler

## Quickstart
```bash
cp .env.example .env
npm i
npm run start:dev
```

Swagger: http://localhost:3000/docs

## E2E tests
Requires a running MongoDB on `MONGODB_URI` (default: localhost).
```bash
npm run test:e2e
```

## WebSocket
Client should connect then:
```js
socket.emit('identify', { userId: '<mongo-user-id>' })
```

Server emits:
- `application:new` to company userId when someone applies
