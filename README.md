# Restaurant Reservation API - Code Review Exercise

A simple Node.js + TypeScript REST API for managing restaurant reservations for a single table.

## Quick Start

### Prerequisites

- Node.js v22
- npm or yarn

### Running the App

```bash
# install
npm install

# DB setup
npm run migrate

# Run app in Development mode
npm run dev

# Or build and run
npm run build
npm start
```

The server will start on `http://localhost:3000`

### Running Tests

```bash
npm test
```

## TypeScript Primer

This project uses TypeScript, a typed superset of JavaScript. If you're coming from another language or primarily use vanilla JavaScript, here's what you need to know:

### What is TypeScript?

TypeScript adds optional static typing to JavaScript. It compiles to regular JavaScript but provides type checking at development/build time.

### Reading TypeScript Syntax

**Type Annotations:**

```typescript
const name: string = "John"; // Variable with type
const age: number = 30;
const active: boolean = true;

function greet(name: string): string {
  // Parameters and return type
  return `Hello, ${name}`;
}
```

**Interfaces (Type Definitions):**

```typescript
interface Reservation {
  id: number;
  customer_id: number;
  party_size: number;
  status: "CONFIRMED" | "SEATED" | "COMPLETED"; // Union type (enum-like)
}
```

**The `any` Type** is equivalent to `Object` in Java. It's essentially untyped. Anything is allowed.

### Common Patterns in This Project

**Express Request/Response:**

```typescript
router.get('/path', (req: Request, res: Response) => {
  const id = req.params.id;        // Path parameter
  const query = req.query.date;    // Query parameter
  const body = req.body;           // Request body
  res.json({ data: ... });         // Send JSON response
});
```

**Type Assertions:**

```typescript
const date = req.query.date as string; // Tell TypeScript "trust me, this is a string"
```

**Optional Properties:**

```typescript
interface User {
  name: string;
  email?: string; // Optional field (may be undefined)
}
```

### Helpful Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

## API Endpoints

**Note**: Endpoints marked with 🔒 require authentication. Include `Authorization: Bearer <token>` header.

### Get all reservations

```
GET /api/reservations
```

### Get reservations for a specific date

```
GET /api/reservations?date=2025-12-25
```

### Check availability

```
GET /api/availability?reservation_time=2025-12-25T18:00:00Z&duration=90
```

Returns whether the requested time is available and shows all reservations within +/- 2 hours (like Resy).

### Create a reservation 🔒

```
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": 123,
  "party_size": 4,
  "reservation_time": "2025-12-25T18:00:00Z",
  "duration_minutes": 90
}
```

### Update reservation status 🔒

```
PUT /api/reservations/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "SEATED"
}
```

Status options: `CONFIRMED`, `SEATED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`

### Cancel a reservation 🔒

```
DELETE /api/reservations/:id
Authorization: Bearer <token>
```

## Database

Uses SQLite for local storage. Database file (`reservations.db`) is created automatically on first run.

## Project Structure

```
migrations/
└── 2024.01.001.create-reservations-table.sql  # Database migrations
src/
├── client/
│   └── db.ts          # Database client
├── routes/
│   └── reservations.ts # Reservation routes
├── types.ts           # TypeScript interfaces
├── index.ts           # Express app setup
└── migrate.ts         # Migration runner (using Umzug)
```

## Testing the API

You can use curl, Postman, or any HTTP client:

```bash
# Create a reservation (with auth)
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-token-123" \
  -d '{"customer_id":456,"party_size":2,"reservation_time":"2025-12-31T19:00:00Z"}'

# Check availability
curl "http://localhost:3000/api/availability?reservation_time=2025-12-31T19:00:00Z&duration=90"

# Get all reservations (no auth required)
curl http://localhost:3000/api/reservations

# Get reservations for a date
curl "http://localhost:3000/api/reservations?date=2025-12-31"

# Update status (with auth)
curl -X PUT http://localhost:3000/api/reservations/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-token-123" \
  -d '{"status":"SEATED"}'

# Cancel reservation (with auth)
curl -X DELETE http://localhost:3000/api/reservations/1 \
  -H "Authorization: Bearer fake-token-123"
```
