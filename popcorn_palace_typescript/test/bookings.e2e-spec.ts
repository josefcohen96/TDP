import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Booking } from '../src/modules/booking/entities/booking.entity';
import { ScreeningSeat } from '../src/modules/screenings/entities/screening-seat.entity';
import { Screening } from '../src/modules/screenings/entities/screening.entity';
import { Movie } from '../src/modules/movies/entities/movie.entity';

describe('BookingsController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let screeningId: string;

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

        // Create a movie
        const movieRes = await request(app.getHttpServer())
            .post('/movies')
            .send({
                title: 'Booking Flow Movie',
                duration: 100,
                genre: 'Test',
                rating: 7.9,
                releaseYear: 2024
            })
            .expect(201);

        const movieId = movieRes.body.id;

        // Create a screening using "Hall 1"
        const screeningRes = await request(app.getHttpServer())
            .post('/screenings')
            .send({
                movieId,
                hallName: 'Hall 1',
                startTime: '2025-05-01T18:00:00.000Z',
                price: 42.5
            })
            .expect(201);

        screeningId = screeningRes.body.id;
    });

    afterAll(async () => {
        const bookingRepo = dataSource.getRepository(Booking);
        const seatRepo = dataSource.getRepository(ScreeningSeat);
        const screeningRepo = dataSource.getRepository(Screening);
        const movieRepo = dataSource.getRepository(Movie);

        await bookingRepo.delete({});
        await seatRepo.delete({});
        await screeningRepo.delete({});
        await movieRepo.delete({});

        await app.close();
    });

    it('should book a valid seat', async () => {
        const res = await request(app.getHttpServer())
            .post('/bookings')
            .send({
                screeningId,
                seats: ['B1'],
            })
            .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.bookedSeats).toContain('B1');
    });

    it('should fail booking an already booked seat', async () => {
        const res = await request(app.getHttpServer())
            .post('/bookings')
            .send({
                screeningId,
                seats: ['B1'],
            })
            .expect(200);

        expect(res.body.success).toBe(false);
        expect(res.body.unavailableSeats).toContain('B1');
    });

    it('should fail booking seat not in layout', async () => {
        const res = await request(app.getHttpServer())
            .post('/bookings')
            .send({
                screeningId,
                seats: ['Z9'],
            })
            .expect(200);

        expect(res.body.success).toBe(false);
        expect(res.body.notInRange).toContain('Z9');
    });

    it('should return 404 for non-existent screening', async () => {
        await request(app.getHttpServer())
            .post('/bookings')
            .send({
                screeningId: '00000000-0000-0000-0000-000000000000',
                seats: ['B1'],
            })
            .expect(404);
    });
});
