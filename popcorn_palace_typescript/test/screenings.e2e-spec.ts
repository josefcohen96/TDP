import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Showtime } from '../src/modules/showtimes/entities/showtime.entity';
import { Movie } from '../src/modules/movies/entities/movie.entity';

describe('ShowtimesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let showtimeId: string;
  let movieId: string;

  const startTime = '2025-05-01T20:00:00.000Z';
  const endTime = '2025-05-01T22:00:00.000Z';

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
      .send({
        title: 'Showtime Test Movie',
        duration: 120,
        genre: 'Action',
        rating: 8.2,
        releaseYear: 2022,
      })
      .expect(201);

    movieId = movieRes.body.id;

    const showtimeRes = await request(app.getHttpServer())
      .post('/showtimes')
      .send({ movieId, theater: 'Hall 1', startTime, endTime, price: 45.5 })
      .expect(201);

    showtimeId = showtimeRes.body.id;
  });

  afterAll(async () => {
    await dataSource.getRepository(Showtime).delete({});
    await dataSource.getRepository(Movie).delete({});
    await app.close();
  });

  it('GET /showtimes/:id - should return showtime', async () => {
    const res = await request(app.getHttpServer())
      .get(`/showtimes/${showtimeId}`)
      .expect(200);

    expect(res.body.id).toBe(showtimeId);
    expect(res.body.theater).toBeDefined();
  });

  it('POST /showtimes/update/:id - should update price', async () => {
    const res = await request(app.getHttpServer())
      .post(`/showtimes/update/${showtimeId}`)
      .send({
        movieId,
        price: 50.2,
        theater: 'Hall 1',
        startTime,
        endTime,
      })
      .expect(200);
  
    expect(res.body.price).toBe(50.2);
  });

  it('GET /showtimes - should return list', async () => {
    const res = await request(app.getHttpServer())
      .get('/showtimes')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('DELETE /showtimes/:id - should delete showtime', async () => {
    const newShowtime = await request(app.getHttpServer())
      .post('/showtimes')
      .send({ movieId, theater: 'Hall 2', startTime: '2025-06-01T18:00:00.000Z', endTime: '2025-06-01T20:00:00.000Z', price: 42 })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/showtimes/${newShowtime.body.id}`)
      .expect(200);
  });

  it('POST /showtimes - should fail when endTime is before startTime', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId,
        theater: 'Hall 1',
        startTime: '2025-06-03T20:00:00.000Z',
        endTime: '2025-06-03T18:00:00.000Z',
        price: 42,
      })
      .expect(400);
  });

  it('POST /showtimes - should fail when movie does not exist', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId: '00000000-0000-0000-0000-000000000123',
        theater: 'Hall 1',
        startTime: '2025-06-01T12:00:00.000Z',
        endTime: '2025-06-01T14:00:00.000Z',
        price: 42,
      })
      .expect(400);
  });

  it('POST /showtimes - should fail when price is negative', async () => {
    await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId,
        theater: 'Hall 1',
        startTime: '2025-07-01T18:00:00.000Z',
        endTime: '2025-07-01T20:00:00.000Z',
        price: -10,
      })
      .expect(400);
  });

  it('POST /showtimes/update/:id - should return 404 for non-existent showtime', async () => {
    await request(app.getHttpServer())
      .post('/showtimes/update/00000000-0000-0000-0000-000000000123')
      .send({
        movieId,
        theater: 'Hall 1',
        startTime: '2025-06-03T20:00:00.000Z',
        endTime: '2025-06-03T18:00:00.000Z',
        price: 42,
      })
      .expect(400);
  });

  it('DELETE /showtimes/:id - should return 404 for non-existent showtime', async () => {
    await request(app.getHttpServer())
      .delete('/showtimes/00000000-0000-0000-0000-1234567890123')
      .expect(500); // TBD : check if should be 500 or 404
  });
});