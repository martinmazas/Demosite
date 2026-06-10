# Demosite Test Suite

End-to-end and API test suite for the [DemoQA Bookstore](https://demoqa.com/books) application, built with [Playwright](https://playwright.dev/) and TypeScript.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Architecture](#architecture)

---

## Overview

This suite covers the DemoQA Bookstore across two layers:

| Layer | What it tests |
|---|---|
| **API** | Auth endpoints (register, token, profile, delete) and Books endpoints (list, get, add, remove, clear) |
| **UI** | Login flow, book catalog, search, detail view, and adding books to a user's collection |

All test data is generated dynamically via [Faker.js](https://fakerjs.dev/), so no fixtures or seeded accounts are needed for most tests.

---

## Project Structure

```
├── fixtures/
│   ├── BaseAPI.ts        # HTTP client base class (GET / POST / DELETE helpers)
│   ├── BasePage.ts       # Page object base class (proxies Page, adds auth helpers)
│   └── index.ts          # Playwright fixture extensions (loginPage, booksPage, api)
│
├── functions/
│   ├── auth.ts           # registerUser / generateToken / getUserProfile / deleteUser
│   ├── books.ts          # listBooks / getBook / addToCollection / removeFromCollection / clearCollection
│   ├── testData.ts       # Faker-based data generators (uniqueUsername, uniquePassword, generateUserData)
│   ├── types.ts          # Shared TypeScript interfaces
│   └── utils.ts          # isPage type guard, createCredentials helper
│
├── pages/
│   ├── BookPage.ts       # Book catalog and search interactions
│   ├── LoginPage.ts      # Login form and error assertions
│   └── RegisterPage.ts   # Registration form
│
├── tests/
│   ├── api/
│   │   ├── auth.api.test.ts    # Auth API tests (TC-A001–TC-A005)
│   │   └── books.api.test.ts   # Books API tests (TC-B001–TC-B005)
│   ├── ui/
│   │   ├── login.spec.ts       # Login UI tests (TC-L001–TC-L002)
│   │   ├── books.spec.ts       # Books UI tests (TC-BU001–TC-BU003, COLL-001)
│   │   └── register.spec.ts    # Registration UI tests (in progress)
│   └── setup/
│       └── auth.setup.ts       # Optional pre-auth state setup
│
├── .env.example          # Environment variable template
├── playwright.config.ts  # Playwright configuration
└── tsconfig.json         # TypeScript configuration
```

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install --with-deps chromium

# 3. Copy the environment template and fill in your values
cp .env.example .env
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `BASE_URL` | Base URL for UI tests (`page.goto('/')` resolves against this) | `https://demoqa.com/books` |
| `API_BASE_URL` | Root URL for API requests | `https://demoqa.com` |
| `TEST_USERNAME` | Existing account used by duplicate-registration tests | `your_test_user` |
| `TEST_PASSWORD` | Password for `TEST_USERNAME` | `your_test_password` |

`TEST_USERNAME` / `TEST_PASSWORD` must belong to an account that already exists in the system so that the "user already exists" error-path test (TC-A002) can assert a `1204` response code.

---

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run with browser visible
npm run test:headed

# Run with Playwright UI (interactive, great for debugging)
npm run test:ui

# Run in debug mode (pauses on each step)
npm run test:debug

# Open the last HTML report
npm run test:report
```

To run a specific file or test:

```bash
# Single file
npx playwright test tests/api/auth.api.test.ts

# Single test by title
npx playwright test --grep "TC-A001"

# All API tests
npx playwright test tests/api/
```

---

## Test Coverage

### Auth API (`tests/api/auth.api.test.ts`)

| ID | Description |
|---|---|
| TC-A001 | New user registered successfully |
| TC-A002 | Duplicate registration returns error code `1204` |
| TC-A003 | Token generated for valid credentials |
| TC-A004 | Profile returns correct user data |
| TC-A005 | Account deletion — user no longer accessible |

### Books API (`tests/api/books.api.test.ts`)

| ID | Description |
|---|---|
| TC-B001 | Book list returns results |
| TC-B002 | Single book fetched by ISBN |
| TC-B003 | Book added to user collection |
| TC-B004 | Book removed from user collection |
| TC-B005 | Entire collection cleared |

### Login UI (`tests/ui/login.spec.ts`)

| ID | Description |
|---|---|
| TC-L001 | Valid credentials — profile page shown |
| TC-L002 | Invalid credentials — error message shown |

### Books UI (`tests/ui/books.spec.ts`)

| ID | Description |
|---|---|
| TC-BU001 | Book catalog displayed in table |
| TC-BU002 | Search filters the book list |
| TC-BU003 | Clicking a book opens the detail view |
| COLL-001 | Logged-in user can add a book to their collection |

---

## Architecture

### Dual-context functions

`registerUser` and `listBooks` are overloaded: they accept either an `APIRequestContext` (REST call) or a Page object (UI interaction). The `isPage` type guard in `utils.ts` drives the dispatch. This means the same logical operation can be exercised at both layers without duplicating setup logic.

### BaseAPI

`BaseAPI` in `fixtures/BaseAPI.ts` is the HTTP client shared by all API helpers. The `get` / `post` / `delete` protected methods handle headers and error throwing; the public methods map 1:1 to API endpoints. Instantiate with a token to get an authenticated client:

```ts
const client = new BaseAPI(api, token);
await client.getUserProfile(userId);
```

### BasePage

`BasePage` in `fixtures/BasePage.ts` wraps a Playwright `Page` via a `Proxy`, so all page methods (`getByRole`, `goto`, `url`, etc.) are available on any subclass without explicit delegation. It also exposes `getAPI()` which lazily builds an `APIRequestContext` authenticated with the token stored in the browser cookie.

### Test data

`generateUserData()` in `functions/testData.ts` generates a fresh user on every call. `createCredentials()` in `utils.ts` wraps it into the `{ credentials }` shape used by all tests, so test setup is a single destructure.
