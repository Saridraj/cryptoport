import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { CryptoDataService } from '../crypto-data/crypto-data.service';
import { Portfolio } from '../entity/portfolio.entity';
import { User } from '../entity/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;
  let portfolioService: PortfolioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PortfolioService,
        CryptoDataService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock repository class
        },
        {
          provide: getRepositoryToken(Portfolio),
          useClass: Repository, // Mock repository class
        },
        {
          provide: PortfolioService,
          useValue: {
            createPortfolio: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(User));
    portfolioService = module.get(PortfolioService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and create a portfolio', async () => {
      const user = {
        id: 'user-id',
        firstname: 'User1',
        lastname: 'userlastname',
        email: 'user1@gmail.com',
        password: '123456',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null); // Mock that no existing user is found
      jest.spyOn(usersRepository, 'save').mockResolvedValue({
        id: 'user-id',
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: 'HashedPassword',
        registeredAt: Date(),
      }); // Mock saving user
      jest.spyOn(portfolioService, 'createPortfolio').mockResolvedValue({}); // Mock creating portfolio
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword'); // Mock bcrypt.hash

      const result = await authService.register(user as User);
      // expect('d').toEqual('sd');
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: user.email }],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 12);
      expect(usersRepository.save).toHaveBeenCalledWith({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: 'hashedPassword',
        registeredAt: expect.any(String),
      });
      expect(portfolioService.createPortfolio).toHaveBeenCalledWith(user.id);
      expect(result).toEqual({
        id: user.id,
        fisrtname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        registeredAt: Date(),
      });
    });

    it('should return status 422 if user already exists', async () => {
      const user = {
        id: 'user-id',
        firstname: 'User1',
        lastname: 'userlastname',
        email: 'user1@gmail.com',
        password: '123456',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: 'hashedPassword',
        registeredAt: expect.any(String),
      }); // Mock that user is found

      const result = await authService.register(user as User);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: user.email }],
      });
      expect(result.statusCode).toEqual(422); // Mocking the response status is tricky. You can improve this based on your implementation
    });
  });

  describe('log in', () => {
    it('should return user info and token if credentials are valid', async () => {
      const user = {
        email: 'user1@gmail.com',
        password: '123456',
      };

      const UserAuthenticated = {
        id: 'user-id',
        firstname: 'User1',
        lastname: 'userlastname',
        email: 'user1@gmail.com',
        password: 'hashedPassword',
      };
      const token = 'fake-jwt-token';

      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(UserAuthenticated as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwt, 'sign').mockImplementation(() => token);

      const result = await authService.logIn(user as User);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: user.email }],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        user.password,
        UserAuthenticated.password,
      );
      expect(result).toEqual({
        id: UserAuthenticated.id,
        firstname: UserAuthenticated.firstname,
        lastname: UserAuthenticated.lastname,
        email: UserAuthenticated.email,
        token: 'fake-jwt-token',
      });
    });

    it('should return status 404 if credentials are invalid', async () => {
      const user = {
        email: 'user1@gmail.com',
        password: 'wrongpassword',
      };

      const UserAuthenticated = {
        id: 'user-id',
        firstname: 'User1',
        lastname: 'userlastname',
        email: 'user1@gmail.com',
        password: 'hashedPassword',
      };

      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(UserAuthenticated as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      const result = await authService.logIn(user as User);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: user.email }],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        user.password,
        UserAuthenticated.password,
      );
      expect(result.statusCode).toEqual(404);
    });
  });
});
