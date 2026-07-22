# Mini Coffee App

Mini Coffee App adalah aplikasi sederhana yang dibuat menggunakan Express.js, Prisma, PostgreSQL, dan Vanilla JavaScript.

## Features

- JWT Authentication
- Coffee Import dari Sample API
- CRUD Transaction
- Search Coffee
- Pagination
- Sorting
- Health Endpoint
- Request Logging
- Error Logging
- Slow Request Logging
- Dashboard

---

## Tech Stack

Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Zod

Frontend

- HTML
- CSS
- Vanilla JavaScript

---

## Login

Username

```
admin
```

Password

```
admin123
```

---

## Backend

Masuk ke folder backend

```bash
cd backend
```

Install

```bash
npm install
```

Migration

```bash
npx prisma migrate dev
```

Run

```bash
npm run dev
```

---

## Frontend

Masuk ke folder frontend

```bash
python3 -m http.server 8080
```

Kemudian buka

```
http://localhost:8080/login.html
```

---

## API

POST

```
/login
```

GET

```
/coffees
```

POST

```
/coffees/import
```

GET

```
/transactions
```

POST

```
/transactions
```

PUT

```
/transactions/:id
```

DELETE

```
/transactions/:id
```

GET

```
/health
```

---

## Logging

Request Log

```
logs/request.log
```

Slow Request Log

```
logs/slow.log
```

Error Log

```
logs/error.log
```
