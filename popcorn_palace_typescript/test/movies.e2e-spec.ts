// test/movies.e2e-spec.ts
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('MoviesController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true, // removes fields that are not in the DTO
                forbidNonWhitelisted: true, // throws an error if there are fields that are not in the DTO
                transform: true, // transforms the payload to the DTO type() in default it is a plain object- so its trnsofrmed all fidels to string) 
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /movies - should create a movie', async () => {
        const response = await request(app.getHttpServer())
            .post('/movies')
            .send({ title: "Matrix", duration: 130, genre: "Sci-Fi", rating: 8.7, releaseYear: 1999 })
            .expect(201);

    });

    it('POST /movies - should not create movie, No HackerField needed', async () => {
        const response = await request(app.getHttpServer())
            .post('/movies')
            .send({ title: "Matrix", duration: 130, HackerField: "1", genre: "Sci-Fi", rating: 8.7, releaseYear: 1999 })
            .expect(400);

    });

    it('GET /movies - should return movie list', async () => {
        const res = await request(app.getHttpServer())
            .get('/movies')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('PATCH /movies/:id - should update a movie', async () => {
        // Step 1: Create a movie
        const createRes = await request(app.getHttpServer())
            .post('/movies')
            .send({ title: "Matrix2", duration: 130, genre: "Sci-Fi", rating: 8.7, releaseYear: 1999 })

            .expect(201);

        const movieId = createRes.body.id;

        // Step 2: Save original details
        const originalMovie = createRes.body;

        // Step 3: Patch the movie title
        const updateRes = await request(app.getHttpServer())
            .patch(`/movies/${movieId}`)
            .send({ title: 'Updated Title' })
            .expect(200);

        const updatedMovie = updateRes.body;

        // Step 4: Assertions
        expect(updatedMovie.id).toBe(movieId);
        expect(updatedMovie.title).toBe('Updated Title');
        expect(updatedMovie.duration).toBe(originalMovie.duration); // unchanged
        expect(updatedMovie.genere).toBe(originalMovie.genere);     // unchanged
        expect(updatedMovie.rating).toBe(originalMovie.rating);     // unchanged
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
