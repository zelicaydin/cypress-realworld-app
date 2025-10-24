# Playwright Tests

This directory contains Playwright end-to-end tests for the Cypress RealWorld App.

## Setup

1. Navigate to the playwright directory:
   ```bash
   cd playwright
   ```

2. Install dependencies and Playwright browsers:
   ```bash
   npm run install
   ```

## Prerequisites

Before running the tests, make sure:
1. The backend server is running on http://localhost:3001
2. The frontend application is running on http://localhost:3000

You can start these from the root directory:
```bash
# Start backend (from root directory)
yarn backend:serve

# Start frontend (in a new terminal, from root directory)
yarn start
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run auth tests specifically
```bash
npm run test:auth
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### View test report
```bash
npm run report
```

## Test Structure

- `tests/auth.spec.ts` - Authentication tests including:
  - User sign-up flow
  - User login/logout
  - Form validation
  - Error handling
  - Session management

## Environment Variables

You can set the following environment variables:
- `API_URL` - Backend API URL (default: http://localhost:3001)
- `BASE_URL` - Frontend URL (default: http://localhost:3000)
- `SEED_DEFAULT_USER_PASSWORD` - Default password for seeded users (default: s3cret)

## Screenshots

Test screenshots are saved to the `screenshots/` directory within the test results.

## Differences from Cypress Tests

The Playwright tests have been converted from the original Cypress tests with the following changes:
- Visual snapshots are replaced with regular screenshots
- Database operations use Playwright's native request context
- Custom commands are implemented as helper functions
- Page interactions use Playwright's locator syntax
