# 🎬 Popcorn Palace – Backend Assignment

Welcome to the **Popcorn Palace** backend – a full-featured movie booking system using **NestJS**, **TypeORM**, **Docker** and **PostgreSQL**. This project showcases strong validation, clean architecture, per-screening seat generation, and a well-tested booking flow.

---

## ✅ Features

### 🎬 Movies
Full CRUD operations.

**Fields**:
- `title`, `duration`, `genre`, `rating (1–10)`, `releaseYear`.

**Validation** via DTOs (`class-validator`).

### 🎟️ Showtimes
Associate a screening with a Movie, Hall, `startTime`, `endTime`, and `price`.

Auto-generates seat map based on hall config.

**Validations**:
- `movieId` must exist.
- `hallName` must be one of the predefined halls.
- `price` must be positive.
- `endTime` must be after `startTime`.

---

### 🧠 Smart EndTime

If `endTime` omitted, it will be:
```ts
endTime = startTime + movie.duration (in minutes)
```

---

### 🪑 Seats
Each screening gets its own layout of seats.

Seat numbers are numeric (`1`, `2`, `3`, ...) and linked to the screening.

The layout is loaded from `/config/halls.config.json`.

---

### 🎫 Bookings
Users can book one or more seats for a screening.

**Input**:
```json
{
  "showtimeId": "<SHOWTIME_ID>",
  "seatNumber": 15,
  "userId": "<UUID>"
}
```

**Validations**:
- Seat must exist and be available.
- Showtime must exist.
- User ID must be valid UUID.

---

### Responses

✅ **Success**:
```json
{
  "success": true,
  "bookedSeat": 15
}
```

❌ **Seat taken**:
```json
{
  "success": false,
  "unavailableSeat": 15
}
```

❌ **Seat doesn't exist**:
```json
{
  "statusCode": 400,
  "message": "Seat not found in this showtime"
}
```

❌ **Showtime doesn't exist**:
```json
{
  "statusCode": 404,
  "message": "Showtime not found"
}
```

---

## ⚙️ Setup

### Prerequisites
- Node.js + npm
- PostgreSQL (local or remote)

### Run Locally
```bash
npm install
npm run start:dev
```

Ensure PostgreSQL is running and configured properly (`.env` or inside `app.module.ts`).

---

## 🧪 Testing

Run full end-to-end tests with:
```bash
npm run test:e2e
```

**Covers**:
- 🎬 Movie CRUD
- 🎟️ Showtimes creation + validation + seat generation
- 🎫 Bookings (valid & invalid scenarios)

---

## 📬 API Reference

### 🎬 Movies

**POST /movies**
```json
{
  "title": "The Matrix",
  "genre": "Sci-Fi",
  "duration": 136,
  "rating": 9,
  "releaseYear": 1999
}
```

**GET /movies**

**PATCH /movies/:id**
```json
{
  "title": "The Matrix Reloaded"
}
```

**DELETE /movies/:id**

---

### 🎟️ Showtimes

**POST /showtimes**
```json
{
  "movieId": "<UUID>",
  "theater": "Hall 1",
  "startTime": "2025-04-06T18:00:00.000Z",
  "endTime": "2025-04-06T20:30:00.000Z",
  "price": 42.5
}
```

**GET /showtimes**

**GET /showtimes/:id**

**POST /showtimes/update/:id**
```json
{
  "movieId": "<UUID>",
  "theater": "Hall 1",
  "startTime": "2025-04-06T18:00:00.000Z",
  "endTime": "2025-04-06T20:30:00.000Z",
  "price": 50.2
}
```

**DELETE /showtimes/:id**

---

### 🎫 Bookings

**POST /bookings**
```json
{
  "showtimeId": "<UUID>",
  "seatNumber": 15,
  "userId": "<UUID>"
}
```

- **Seat Taken**: `200 OK` with `success: false`
- **Invalid Input**: `400 Bad Request`
- **Showtime Not Found**: `404 Not Found`
