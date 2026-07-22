# ☕ Mini Coffee App

Mini Coffee App is a full-stack application developed as an advanced mini application technical test.

The application fetches coffee data from the public Sample APIs, stores the data in a local PostgreSQL database, and provides authenticated transaction management through a simple dashboard.

---

## Features

### Authentication

- Login authentication
- JWT-based authentication
- Bearer Token authorization
- Protected backend APIs
- Automatic redirect when the token is unavailable

### Coffee Master Data

- Import coffee data from Sample APIs
- Store imported data in PostgreSQL
- Display coffee data from the local database
- Search coffee
- Pagination and sorting support

### Transaction Management

- Create coffee transactions
- Display transaction history
- Update transactions
- Delete transactions
- Input validation using Zod

### Logging and Monitoring

- Request logging
- Transaction logging
- Error logging
- Slow-response logging
- Health-check endpoint
- Error alert simulation after more than three errors
- Graceful JSON error responses

### Docker

- Backend Dockerfile
- Frontend Dockerfile
- PostgreSQL container
- Docker Compose
- PostgreSQL health check
- Automatic Prisma migration

---

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Token
- Zod
- Axios

### Frontend

- HTML
- CSS
- Vanilla JavaScript

### DevOps

- Docker
- Docker Compose
- Nginx

---

## Project Structure

```text
mini-app/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   ├── logs/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── login.html
│   ├── dashboard.html
│   └── Dockerfile
│
├── screenshot/
├── docker-compose.yml
└── README.md
```

---

## External API

Coffee data is fetched from:

```text
https://api.sampleapis.com/coffee/hot
```

The imported data is stored in the application's own PostgreSQL database.

---

## Database Design

The application contains the required master and transactional tables.

### Master Table

`Coffee`

Main fields:

- `id`
- `apiId`
- `title`
- `description`
- `image`

### Transactional Table

`Transaction`

Main fields:

- `id`
- `coffeeId`
- `qty`
- `notes`
- `createdAt`

Relationship:

```text
Coffee 1 ──────── * Transaction
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/login` | Authenticate user and generate JWT | Public |
| GET | `/profile` | Get authenticated user profile | Bearer Token |

### Coffee

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/coffees` | Get coffee data from the local database | Bearer Token |
| POST | `/coffees/import` | Import coffee from Sample APIs | Bearer Token |

Example query:

```text
GET /coffees?search=latte&page=1&limit=5&sort=title&order=asc
```

### Transactions

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/transactions` | Get transaction history | Bearer Token |
| POST | `/transactions` | Create a transaction | Bearer Token |
| PUT | `/transactions/:id` | Update a transaction | Bearer Token |
| DELETE | `/transactions/:id` | Delete a transaction | Bearer Token |

### Monitoring

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Application health check |
| GET | `/slow` | Slow-response simulation |
| GET | `/error` | Error and alert simulation |

---

## Authentication Flow

1. User submits a username and password.
2. Backend validates the credentials.
3. Backend returns a JWT access token.
4. Frontend stores the token in `localStorage`.
5. Protected API requests send the token through:

```http
Authorization: Bearer <token>
```

6. Requests without a valid token receive an HTTP `401 Unauthorized` response.

---

## Validation and Error Handling

Request validation is implemented using Zod.

Examples:

- `coffeeId` is required.
- `qty` must be an integer.
- `qty` must be at least `1`.
- Invalid requests return an appropriate HTTP status code.
- Missing transactions return `404 Not Found`.
- Unauthorized requests return `401 Unauthorized`.
- Unexpected server errors return `500 Internal Server Error`.

Example error response:

```json
{
  "success": false,
  "message": "Transaction not found"
}
```

---

## Logging

The backend records application activity into log files.

### Request Log

```text
backend/logs/request.log
```

Contains:

- HTTP method
- Endpoint
- HTTP status
- Response time

Example:

```text
POST /transactions | 201 | 45 ms
GET /coffees | 200 | 21 ms
```

### Transaction Log

```text
backend/logs/transaction.log
```

Records transaction operations such as:

- Transaction creation
- Transaction update
- Transaction deletion

### Error Log

```text
backend/logs/error.log
```

Records application errors and failed requests.

### Slow Request Log

```text
backend/logs/slow.log
```

Records requests that exceed the configured response-time threshold.

---

## Monitoring and Reliability

### Health Check

The `/health` endpoint returns the current application status.

```json
{
  "status": "UP"
}
```

### Error Alert Simulation

The `/error` endpoint simulates server errors.

After the error occurs more than three times, the application displays an alert:

```text
🚨 ALERT !!
Total Error : 4
```

### Slow Response Simulation

The `/slow` endpoint simulates a delayed response.

Slow requests are recorded in:

```text
backend/logs/slow.log
```

### Graceful Error Handling

Errors are handled by a global error middleware.

The server returns a structured JSON error instead of terminating the application.

---

# Application Evidence

## Login Page

The application requires the user to authenticate before accessing the dashboard.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/login.png"
    width="850"
    alt="Mini Coffee App login page"
  >
</p>

---

## Dashboard and Coffee Master Data

Coffee data displayed on this page is loaded from the backend API and local PostgreSQL database.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/dashboard.png"
    width="850"
    alt="Mini Coffee App dashboard"
  >
</p>

---

## Transaction Input Form

The user selects a coffee, enters the quantity and notes, and submits the transaction through the dashboard.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/create-transaction.png"
    width="850"
    alt="Create coffee transaction form"
  >
</p>

---

## Transaction History

Created transactions are displayed in the transaction history table and can be updated or deleted.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/transaction-history.png"
    width="850"
    alt="Coffee transaction history"
  >
</p>

---

## Protected API

Protected endpoints require a valid JWT Bearer Token.

A request without a token returns HTTP `401 Unauthorized`.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/api-protected.png"
    width="850"
    alt="Protected API unauthorized response"
  >
</p>

---

## API CRUD Operation

The backend supports GET, POST, PUT, and DELETE operations and returns JSON responses with appropriate HTTP status codes.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/api-crud.png"
    width="850"
    alt="Backend CRUD API response"
  >
</p>

---

## Health Check

The backend health endpoint confirms that the application is running.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/health-check.png"
    width="850"
    alt="Application health check response"
  >
</p>

---

## Error Alert Simulation

After the simulated error occurs more than three times, the backend generates an alert.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/alert-error.png"
    width="850"
    alt="Error alert after more than three errors"
  >
</p>

---

## Slow Response Simulation

The `/slow` endpoint simulates a slow response, which is recorded in the slow-request log.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/slow-response.png"
    width="850"
    alt="Slow response simulation"
  >
</p>

---

## Application Logs

The application records the method, endpoint, status code, and response time.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/logs.png"
    width="850"
    alt="Backend request and error logs"
  >
</p>

---

## Docker Compose

The backend, frontend, and PostgreSQL services run using Docker Compose.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/DitoIhkam/LinkIT/main/mini-app/screenshot/docker-compose.png"
    width="850"
    alt="Docker Compose services"
  >
</p>

---

## Requirement Traceability

| Requirement | Implementation | Evidence |
|---|---|---|
| Login authentication | `POST /login` | Login screenshot |
| JWT/Bearer Token | Authentication middleware | Protected API screenshot |
| Protected APIs | Coffee and transaction routes | Unauthorized `401` screenshot |
| Master table | `Coffee` | Dashboard screenshot |
| Transaction table | `Transaction` | Transaction history screenshot |
| Store external API data | `/coffees/import` | Dashboard after import |
| GET API | Coffee and transaction list | Dashboard/API screenshot |
| POST API | Import and transaction creation | CRUD screenshot |
| PUT API | Transaction update | Transaction history |
| DELETE API | Transaction deletion | Transaction history |
| JSON response | Express API responses | API screenshot |
| Validation | Zod schemas | Invalid request response |
| Error handling | Global error middleware | Error response screenshot |
| Transaction form | Dashboard form | Transaction input screenshot |
| Request logging | Request logger | Logs screenshot |
| Transaction logs | Transaction logger | Logs screenshot |
| Error logs | Error middleware | Alert/log screenshot |
| `/health` endpoint | Health controller | Health screenshot |
| Error more than 3 times | Error counter and alert | Error alert screenshot |
| Slow-response simulation | `/slow` endpoint | Slow-response screenshot |
| Dockerfile | Backend and frontend Dockerfile | Docker Compose screenshot |

---

## Running with Docker

### Start the Application

```bash
docker compose up -d --build
```

### Check Running Containers

```bash
docker compose ps
```

### View Backend Logs

```bash
docker compose logs -f backend
```

### Stop the Application

```bash
docker compose down
```

---

## Application Access

| Service | URL |
|---|---|
| Frontend | `http://localhost:8080/login.html` |
| Backend API | `http://localhost:3000` |
| Health Check | `http://localhost:3000/health` |

---

## Default Login

```text
Username: admin
Password: admin123
```

> The default credentials are provided for demonstration and technical-test purposes only.

---

## Testing the Error Alert

Run the error endpoint four times:

```bash
for i in {1..4}; do
  curl http://localhost:3000/error
  echo
done
```

View the backend logs:

```bash
docker compose logs backend --tail=100
```

Expected alert:

```text
🚨 ALERT !!
Total Error : 4
```

---

## Testing Protected API Access

Request without a JWT:

```bash
curl -i http://localhost:3000/coffees
```

Expected status:

```text
HTTP/1.1 401 Unauthorized
```

Request with a JWT:

```bash
curl \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/coffees
```

---

## Testing the Health Endpoint

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "UP"
}
```

---

## Assignment Completion

| Category | Status |
|---|---|
| Backend API | ✅ |
| Authentication | ✅ |
| JWT/Bearer Token | ✅ |
| Protected API | ✅ |
| PostgreSQL Database | ✅ |
| Master Table | ✅ |
| Transaction Table | ✅ |
| External API Import | ✅ |
| GET, POST, PUT, DELETE | ✅ |
| JSON Response | ✅ |
| Validation | ✅ |
| Error Handling | ✅ |
| Login Page | ✅ |
| Dashboard | ✅ |
| Transaction Form | ✅ |
| Request Logging | ✅ |
| Transaction Logging | ✅ |
| Error Logging | ✅ |
| Health Endpoint | ✅ |
| Error Alert Simulation | ✅ |
| Slow Response Simulation | ✅ |
| Graceful Error Handling | ✅ |
| Dockerfile | ✅ |
| Docker Compose | ✅ |

---

## Author

**Dito Ihkam**

Mini Coffee App — Technical Test Submission
