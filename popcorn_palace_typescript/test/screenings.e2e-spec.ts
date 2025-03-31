import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Screening } from '../src/modules/screenings/entities/screening.entity';
import { Movie } from '../src/modules/movies/entities/movie.entity';

describe('ScreeningsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let screeningId: string;

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
                title: 'Screening Test Movie',
                duration: 120,
                genre: 'Action',
                rating: 8.2,
                releaseYear: 2022,
            })
            .expect(201);

        const movieId = movieRes.body.id;

        const screeningRes = await request(app.getHttpServer())
            .post('/screenings')
            .send({
                movieId,
                hallName: 'Hall 1',
                startTime: '2025-05-01T20:00:00.000Z',
                price: 45.5,
            })
            .expect(201);

        screeningId = screeningRes.body.id;
    });

    afterAll(async () => {
        await dataSource.getRepository(Screening).delete({});
        await dataSource.getRepository(Movie).delete({});
        await app.close();
    });

    it('GET /screenings/:id - should return screening', async () => {
        const res = await request(app.getHttpServer())
            .get(`/screenings/${screeningId}`)
            .expect(200);

        expect(res.body.id).toBe(screeningId);
        expect(res.body.hallName).toBeDefined();
    });

    it('PATCH /screenings/:id - should update price', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/screenings/${screeningId}`)
            .send({ price: 50 })
            .expect(200);

        expect(res.body.price).toBe(50);
    });

    it('GET /screenings - should return list', async () => {
        const res = await request(app.getHttpServer())
            .get('/screenings')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('DELETE /screenings/:id - should delete screening', async () => {
        await request(app.getHttpServer())
            .delete(`/screenings/${screeningId}`)
            .expect(204);
    });
});
