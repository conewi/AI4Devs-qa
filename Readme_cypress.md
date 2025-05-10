# Cypress End-to-End Tests for Position Management Page

This document provides instructions on how to run the Cypress end-to-end tests for the position management page with drag and drop functionality.

## Prerequisites

Before running the tests, make sure you have:

1. Node.js and npm installed on your machine
2. PostgreSQL database running
3. The application seeded with test data
4. Both frontend and backend servers running

## Setup Steps

1. **Install dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Ensure the database is running**:
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations and seed data**:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   npx ts-node seed.ts
   ```

4. **Start backend server**:
   ```bash
   cd backend
   npm run dev
   ```

5. **Start frontend server** (in a separate terminal):
   ```bash
   cd frontend
   npm start
   ```

## Running the Cypress Tests

Once the application is running, you can execute the Cypress tests with the following commands:

1. **Open Cypress Test Runner**:
   ```bash
   cd frontend
   npx cypress open
   ```

2. **Run tests in headless mode**:
   ```bash
   cd frontend
   npx cypress run
   ```

## Test Scenarios

The Cypress tests cover the following scenarios for the position management page:

1. Verify that the position title is displayed correctly
2. Verify that interview flow columns are displayed correctly
3. Verify that candidate cards appear in the correct columns
4. Verify drag and drop functionality between columns
5. Verify that candidates can be moved between columns
6. Verify that the backend API is called correctly when candidates are moved

## Notes

- The tests use the seed data created in `backend/prisma/seed.ts`
- The tests focus on position ID 1 (Senior Full-Stack Engineer)
- If the tests fail, ensure that:
  - The database contains the expected seed data
  - Both frontend and backend servers are running
  - The correct position ID is being used in the tests 