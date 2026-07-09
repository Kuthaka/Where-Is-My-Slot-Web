# Where Is My Slot — Backend v2

A clean, dependency-injection-free Express + TypeScript backend using **Clean Architecture** (Domain → Application → Infrastructure → Presentation).

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| Database | MongoDB via Mongoose |
| Auth | JWT (jsonwebtoken) |
| Email | Nodemailer (SMTP) |
| File Upload | Multer + Cloudinary |
| Validation | Native + Zod (ready to use) |

---

## Project Structure

```
backend-v2/
└── src/
    ├── index.ts                  # Entry point (bootstrap)
    ├── app.ts                    # App factory + DI composition root
    │
    ├── shared/                   # Cross-cutting concerns
    │   ├── enums/
    │   │   ├── user-role.enum.ts
    │   │   └── status-code.enum.ts
    │   ├── constants/
    │   │   └── error-messages.ts
    │   ├── errors/
    │   │   └── app-error.ts      # Typed error classes
    │   └── middleware/
    │       ├── auth.middleware.ts       # JWT + role guard
    │       ├── error-handler.middleware.ts
    │       └── response.middleware.ts  # sendSuccess/sendCreated helpers
    │
    ├── infrastructure/           # External services & DB
    │   ├── database/
    │   │   ├── connection.ts
    │   │   └── models/           # Mongoose schemas
    │   ├── repositories/         # Mongoose repository implementations
    │   └── services/
    │       ├── email.service.ts
    │       └── cloudinary.service.ts
    │
    └── modules/
        ├── auth/
        │   ├── domain/           # OTP entity + repo interface
        │   ├── application/      # Use cases: sendOtp, verifyOtp, login, register, setPassword
        │   └── presentation/     # auth.router.ts
        │
        ├── users/
        │   └── domain/           # User entity + repo interface
        │
        ├── businesses/
        │   ├── domain/           # Business entity + repo interface
        │   ├── application/      # Use cases: onboard, update, adminManage
        │   └── presentation/     # business.router.ts
        │
        └── posts/
            ├── domain/           # Post entity + repo interface
            ├── application/      # Use case: createPost
            └── presentation/     # posts.router.ts, flash-deals.router.ts
```

---

## API Routes

All routes are prefixed with `/api/v1`.

### Auth (`/api/v1/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/send-otp` | — | Send OTP to email |
| POST | `/verify-otp` | — | Verify OTP and get token |
| POST | `/login` | — | Login with email + password |
| POST | `/register` | — | Register new USER account |
| GET | `/check-availability` | — | Check username/email availability |
| POST | `/set-password` | JWT | Change or set password |
| GET | `/me` | JWT | Get current user |

### Businesses (`/api/v1/businesses`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/explore` | — | Public business listing with cursor pagination |
| GET | `/me` | JWT (BUSINESS) | Get my business |
| PATCH | `/me` | JWT (BUSINESS) | Update my business |
| POST | `/onboard` | JWT (BUSINESS) | Create business profile |
| POST | `/upload-image` | JWT (BUSINESS) | Upload image to Cloudinary |
| GET | `/` | JWT (SUPER_ADMIN) | Get all businesses |
| POST | `/admin/add` | JWT (SUPER_ADMIN) | Admin create business |
| POST | `/:id/approve` | JWT (SUPER_ADMIN) | Approve business |
| POST | `/:id/reject` | JWT (SUPER_ADMIN) | Reject business |

### Posts (`/api/v1/posts`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Get posts (cursor pagination) |
| POST | `/` | JWT | Create post |
| POST | `/:id` | JWT | Update post |
| DELETE | `/:id` | JWT | Delete post |
| POST | `/:id/like` | JWT | Toggle like |
| POST | `/:id/comments` | JWT | Add comment |
| GET | `/:id/comments` | — | Get comments |
| DELETE | `/comments/:id` | JWT | Delete comment |

### Flash Deals (`/api/v1/flash-deals`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Get active flash deals |
| POST | `/` | JWT | Create flash deal (24h) |

### Misc

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/seed` | Seed test data |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in values (MongoDB Atlas URI, SMTP, Cloudinary)
cp .env.example .env

# 3. Start dev server (hot reload)
npm run dev

# 4. Build for production
npm run build
npm start
```

> **Note:** If MongoDB Atlas connection fails, add your current IP to the Atlas IP Access List at https://cloud.mongodb.com → Network Access.

---

## Clean Architecture Principles Applied

1. **Domain Layer** — Pure TypeScript entities and repository interfaces. Zero framework or DB dependencies.
2. **Application Layer** — Use cases that orchestrate domain logic. Only import domain interfaces, not implementations.
3. **Infrastructure Layer** — Mongoose models and repository implementations. Email and Cloudinary services.
4. **Presentation Layer** — Express routers. Receive HTTP, call use cases, return responses.
5. **Composition Root** — `app.ts` is the only place where concrete implementations are wired to interfaces. No DI framework needed.

### Key Design Decisions

- **No DI framework** — Dependencies are passed as constructor arguments, keeping things explicit and easy to test.
- **Typed errors** — `AppError` hierarchy (`BadRequestError`, `NotFoundError`, etc.) with proper HTTP status codes.
- **Response wrapper** — All API responses follow `{ success, statusCode, message, data }` format via `sendSuccess()`.
- **Role guard factory** — `requireRoles(...roles)` creates a middleware closure — simple and composable.
