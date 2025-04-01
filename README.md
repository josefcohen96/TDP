# 🎬 Popcorn Palace – Backend Assignment

Welcome to the **Popcorn Palace** backend project – a fully functional movie booking backend built using **NestJS**, **TypeORM**, and **PostgreSQL**. This project showcases clean architecture, robust validation, and comprehensive end-to-end testing using **Jest** and **Supertest**.

---

## ✅ Features

### 🎬 Movies
- Create, update, delete, and fetch movie entries.
- Properties: `title`, `duration`, `genre`, `rating`, `releaseYear`.
- Validated using NestJS DTOs and Pipes.

### 🎟️ Screenings (Showtimes)
- Create, update, delete, and fetch screening data.
- Fields:
  - `movieId`: must reference an existing movie.
  - `hallName`: must match one from the configured halls.
  - `startTime`: required.
  - `endTime`: optional, auto-calculated if omitted.
  - `price`: required, must be positive.

#### 🧠 EndTime Logic
- If `endTime` is omitted → it is auto-calculated as:
  ```
  endTime = startTime + movie.duration (in minutes)
  ```
- If `endTime` is provided → must be:
  - A valid date.
  - Later than `startTime` → else returns `400 Bad Request`.

### 🪑 Seats
- Seats are dynamically generated from a hall layout (defined in JSON).
- Each screening gets a unique seat map (e.g., A1–A10, B1–B5).

### 🎫 Bookings
- Users can book one or more seats for a specific screening.
- Booking flow includes:
  - ✅ Validation that seats exist.
  - ✅ Validation that seats are available.
  - ❌ Returns failure reason if seats are taken or invalid.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js & npm
- PostgreSQL running and configured

### Installation & Running

```bash
npm install
npm run start:dev
```

- Make sure PostgreSQL is up and `.env` (or `app.module.ts`) is properly configured.

---

## 🧪 Testing

End-to-end tests are located in the `/test` folder.

```bash
npm run test:e2e
```

Test coverage includes:
- Movie CRUD operations
- Screening creation (with/without endTime), update, delete, fetch
- Booking flow (valid and invalid scenarios)

---

## 📬 API Endpoints & Examples

### 🎬 Movies

#### Create Movie
```http
POST /movies
```
```json
{
  "title": "The Matrix",
  "genre": "Sci-Fi",
  "duration": 136,
  "rating": 9,
  "releaseYear": 1999
}
```

#### Get All Movies
```http
GET /movies
```

#### Update Movie
```http
PATCH /movies/:id
```
```json
{
  "title": "The Matrix Reloaded",
  "duration": 138,
  "rating": 8.7
}
```

#### Delete Movie
```http
DELETE /movies/:id
```

---

### 🎟️ Screenings

#### Create Screening
```http
POST /screenings
```
```json
{
  "movieId": "<MOVIE_ID>",
  "hallName": "Hall 1",
  "startTime": "2025-04-06T18:00:00.000Z",
  "endTime": "2025-04-06T20:30:00.000Z", // optional
  "price": 44.5
}
```

#### Get All Screenings
```http
GET /screenings
```

#### Get Screening by ID
```http
GET /screenings/:id
```

#### Update Screening
```http
PATCH /screenings/:id
```
```json
{
  "startTime": "2025-04-06T20:00:00.000Z",
  "price": 44.5
}
```

#### Delete Screening
```http
DELETE /screenings/:id
```

---

### 🎫 Bookings

#### Create Booking
```http
POST /bookings
```
```json
{
  "screeningId": "<SCREENING_ID>",
  "seats": ["A1", "A2"]
}
```

- **Success** → `201 Created`
- **Failure** → `200 OK` with reasons like `unavailableSeats` or `notInRange`

---

## 🧼 Validation & Data Handling

- **Global ValidationPipe**:
  - `whitelist: true` → strips unknown fields
  - `forbidNonWhitelisted: true` → throws error on unknown fields
  - `transform: true` → converts inputs to correct types
- **DTOs** ensure type-safety and consistency

---

## 📁 Project Structure

```
src/
├── modules/
│   ├── movies/
│   ├── screenings/
│   ├── bookings/
│   └── halls/ (config-based)
├── common/
│   └── app.logger.ts
├── main.ts
├── app.module.ts
└── config/
    └── load-halls.ts
```

---

## 📌 Notes

- `endTime` is intelligently handled and validated.
- Seats are uniquely generated per screening.
- Bookings prevent double-seating.
- Deleting a screening removes associated seats and blocks new bookings.

---

## ✅ Final Tips

- Follow DTO formats strictly for API requests.
- Run tests frequently using `npm run test:e2e`.
- Logging is handled with a custom `AppLogger` for clear output.

---

Feel free to reach out if anything needs clarification!
