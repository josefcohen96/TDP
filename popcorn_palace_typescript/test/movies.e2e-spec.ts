import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

import { Movie } from '../src/modules/movies/entities/movie.entity';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.getRepository(Movie).delete({});
    await app.close();
  });


    it('POST /movies - should create a movie', async () => {
        const response = await request(app.getHttpServer())
            .post('/movies')
            .send({ title: "Matrix", duration: 130, genre: "Sci-Fi", rating: 8.7, releaseYear: 1999 })
            .expect(201);

    });

    it('POST /movies - should not create movie, No HackerField needed', async () => {
        await request(app.getHttpServer())
            .post('/movies')
            .send({ title: "Matrix", duration: 130, HackerField: "1", genre: "Sci-Fi", rating: 8.7, releaseYear: 1999 })
            .expect(400);
    });

    it('GET /movies/all - should return movie list', async () => {
        const res = await request(app.getHttpServer())
            .get('/movies/all')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /movies/update/:title - should update a movie by title', async () => {
        const title = 'MatrixToUpdate';

        await request(app.getHttpServer())
            .post('/movies')
            .send({ title, duration: 130, genre: "Action", rating: 7.5, releaseYear: 2020 })
            .expect(201);

        const res = await request(app.getHttpServer())
            .post(`/movies/update/${title}`)
            .send({ title: "MatrixUpdated" })
            .expect(200);

        expect(res.body.title).toBe('MatrixUpdated');
    });


    it('POST /movies - should fail without title', async () => {
        await request(app.getHttpServer())
            .post('/movies')
            .send({ duration: 120, genre: "Drama", rating: 7.8, releaseYear: 2023 })
            .expect(400);
    });

    it('POST /movies - should fail with non-numeric duration', async () => {
        await request(app.getHttpServer())
            .post('/movies')
            .send({ title: "Test", duration: "abc", genre: "Drama", rating: 7.8, releaseYear: 2023 })
            .expect(400);
    });

    it('PATCH /movies/:id - should return 404 for non-existent movie', async () => {
        await request(app.getHttpServer())
            .patch('/movies/00000000-0000-0000-0000-000000000000')
            .send({ title: 'Nope' })
            .expect(404);
    });

    it('DELETE /movies/:id - should return 404 for non-existent movie', async () => {
        await request(app.getHttpServer())
            .delete('/movies/00000000-0000-0000-0000-000000000000')
            .expect(404);
    });

});
