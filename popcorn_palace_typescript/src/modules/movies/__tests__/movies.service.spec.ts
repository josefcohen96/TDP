import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockMovie = {
  id: '1',
  title: 'Inception',
  duration: 148,
};

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: Repository<Movie>;

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mockMovie),
    find: jest.fn().mockResolvedValue([mockMovie]),
    findOneBy: jest.fn().mockResolvedValue(mockMovie),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a movie', async () => {
      const dto = { title: 'Inception', duration: 148 };
      const result = await service.create(dto);
      expect(result).toEqual(mockMovie);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if title or duration missing', async () => {
      await expect(service.create({ title: '', duration: null } as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('should return an array of movies', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockMovie]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should update and return the movie', async () => {
      const updated = await service.update('1', { title: 'Updated Movie' });
      expect(updated).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.update('2', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should remove the movie', async () => {
      await expect(service.remove('1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if movie not found', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValueOnce({ raw: 0 });
      await expect(service.remove('99')).rejects.toThrow(NotFoundException);
    });
  });
});
