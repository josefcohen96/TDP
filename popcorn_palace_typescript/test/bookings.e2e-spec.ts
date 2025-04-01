import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Booking } from '../src/modules/booking/entities/booking.entity';
import { Showtime } from '../src/modules/showtimes/entities/showtime.entity';
import { ShowtimeSeat } from '../src/modules/showtimes/entities/showtime-seat.entity';
import { Movie } from '../src/modules/movies/entities/movie.entity';

describe('BookingsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let showtimeId: string;
  let userId = '84438967-f68f-4fa0-b620-0f08217e76af';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    dataSource = app.get(DataSource);

    const movieRes = await request(app.getHttpServer())
      .post('/movies')
      .send({ title: 'Test Movie', duration: 120, genre: 'Action', rating: 8.2, releaseYear: 2022 })
      .expect(200);

    const movieId = movieRes.body.id;

    const showtimeRes = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId,
        theater: 'Hall 1',
        startTime: '2025-05-01T20:00:00.000Z',
        endTime: '2025-05-01T22:00:00.000Z',
        price: 50,
      })
      .expect(200);

    showtimeId = showtimeRes.body.id;
  });

  afterAll(async () => {
    await dataSource.getRepository(Booking).delete({});
    await dataSource.getRepository(ShowtimeSeat).delete({});
    await dataSource.getRepository(Showtime).delete({});
    await dataSource.getRepository(Movie).delete({});
    await app.close();
  });

  it('should book a valid seat', async () => {
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 5, userId })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.bookedSeat).toBe(5);
  });

  it('should fail booking an already booked seat', async () => {
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 5, userId })
      .expect(400);

    expect(res.body.message).toContain('already taken');
  });

  it('should fail booking seat not in layout', async () => {
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 99, userId })
      .expect(400);

    expect(res.body.message).toContain('not found in');
  });

  it('should fail booking for non-existent showtime', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId: '00000000-0000-0000-0000-000000000000', seatNumber: 1, userId })
      .expect(404);
  });

  it('should fail with missing seatNumber', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, userId })
      .expect(400);
  });

  it('should fail with invalid seatNumber (non-numeric)', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 'A1', userId })
      .expect(400);
  });

  it('should book multiple available seats', async () => {
    const res1 = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 6, userId })
      .expect(200);

    const res2 = await request(app.getHttpServer())
      .post('/bookings')
      .send({ showtimeId, seatNumber: 7, userId })
      .expect(200);

    expect(res1.body.bookedSeat).toBe(6);
    expect(res2.body.bookedSeat).toBe(7);
  });
});
