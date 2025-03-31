# Popcorn Palace – Backend Assignment Instructions

Welcome to the Popcorn Palace backend project! This application was built using **NestJS**, **TypeORM**, and **PostgreSQL**, and is fully tested using **end-to-end (e2e)** tests powered by **Jest** and **Supertest**.

This document explains the key features, architecture, how to run the project, and example API usage.

---

## ✅ Features Implemented

### 🎬 Movies
- Create, update, delete, and fetch movie entries.
- Movies have: `title`, `duration`, `genre`, `rating`, `releaseYear`.
- Validation is enforced using NestJS DTOs and Pipes.

### 🎟️ Screenings (Showtimes)
- Create, update, delete, and fetch screenings.
- A screening contains:
  - `movieId` (must exist)
  - `hallName` (must match one from the halls config)
  - `startTime` (required)
  - `endTime` (optional, auto-calculated if omitted)
  - `price` (required, must be positive)

#### 🧠 EndTime Logic:
- If `endTime` is not provided, it is automatically calculated based on:
  ```ts
  endTime = startTime + movie.duration (in minutes)
