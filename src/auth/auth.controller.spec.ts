import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { CryptoDataService } from '../crypto-data/crypto-data.service';
import { User } from '../entity/user.entity';
import { Portfolio } from '../entity/portfolio.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        PortfolioService,
        CryptoDataService,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            logIn: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock repository class
        },
        {
          provide: getRepositoryToken(Portfolio),
          useClass: Repository, // Mock repository class
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register and return its result', async () => {
      const user = {
        id: 'user-id',
        firstname: 'User1',
        lastname: 'userlastname',
        email: 'user1@gmail.com',
        password: '123456',
      };

      const registerResult = {
        id: 'user-id',
        firstname: 'User1',
        lastname: 'userlastname',
        email: 'user1@gmail.com',
        registeredAt: new Date(),
      };

      jest.spyOn(authService, 'register').mockResolvedValue(registerResult);

      const result = await authController.register(user as User);

      expect(authService.register).toHaveBeenCalledWith(user);
      expect(result).toEqual(registerResult);
    });
  });

  describe('logIn', () => {
    it('should call AuthService.logIn and return its result', async () => {
      const user = {
        email: 'user1@gmail.com',
        password: '123456',
      };

      const logInResult = {
        userData: {
          id: 'user-id',
          firstname: 'User1',
          lastname: 'userlastname',
          email: 'user1@gmail.com',
        },
        token: 'fake-jwt-token',
      };

      jest.spyOn(authService, 'logIn').mockResolvedValue(logInResult);

      const result = await authController.logIn(user as User);
      expect(authService.logIn).toHaveBeenCalledWith(user);
      expect(result).toEqual(logInResult);
    });
  });
});
