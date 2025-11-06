# Inventory Management Backend (FIFO)

## Quick start (local)
1. Copy `.env.example` to `.env` and edit
2. Start local infra:
   - With Docker: `docker-compose up --build`
   - OR run Postgres + Redpanda separately
3. Run migrations: `npm run migrate` (or in docker the container runs it)
4. Start backend: `npm run dev`
5. Use `node producer.js` to produce demo Kafka events
6. API:
   - POST /auth/login  { username, password } -> token
   - GET /api/products  (Bearer token)
   - GET /api/ledger  (Bearer token)
   - POST /api/simulate { events: [...] } to publish events via server

## Demo login:
- username: admin
- password: password
- token returned: use as `Authorization: Bearer <token>`
