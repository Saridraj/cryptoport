# Cryptoport backend system

The Cryptoport backend system is an application that operates on the backend of the Cryptoport application. This document provides an explanation of the Cryptoport backend system design, API documentation, project setup, and project testing. The details are as follows.

## 1. System Design
    The Cryptoport backend system is developed using the Nest.js framework and a MySQL database. It consists of three modules as follows:
      (1) Auth Module includes the AuthModule, AuthController, and AuthService classes. It manages two entities, User and Portfolio, and supports two operations: register() and logIn().
      (2) Portfolio Module includes the PortfolioModule, PortfolioController, and PortfolioService classes. And it manages Portfolio entities. It have two operations are createPortfolio and getUserPortfolio().
      (3) Crypto Data Module includes the CryptoDataModule, CryptoDataController, and CryptoDataService classes. This module handles fetching data from the crypto API provider.
   
 follow in this class diagram. ![alt text](https://res.cloudinary.com/dmdxfjunb/image/upload/v1718969121/kryptodian_eavtbh.jpg)
 
## 2. API Documentation
    The Cryptoport backend system provides 3 API paths accessible at http://localhost:4000/api. The details are as follows. 
      (1) Register User: handles user registration with a POST request at the path /auth/register.
      (2) Log In: This endpoint handles user log-in with a POST request at /auth/logIn.
      (3) getPortfolio: This endpoint provide user portfolio with a GET request at /portfolio/:userId.
      
All API have details are follows ![alt API Documentation](https://documenter.getpostman.com/view/19296288/2sA3XTfLKb) .
## 3. Project Setup

## 4. Project Testing








## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


