# Where-Is-My-Slot - Backend Architecture Documentation

## Overview
The backend for "Where-Is-My-Slot" is built using **NestJS**, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. The architecture follows a Modular Monolith pattern, ensuring clean separation of concerns, scalability, and ease of maintenance.

## Tech Stack
*   **Framework:** NestJS (TypeScript)
*   **Database:** PostgreSQL (hosted on Neon)
*   **ORM:** Prisma v7
*   **Authentication:** Passport.js with JWT
*   **Validation:** Joi (for env) and class-validator (for payloads)

## Project Structure
The backend is structured into three main directories under `src/`:

1.  **`core/`**: Contains global utilities and configurations that are used throughout the application.
    *   `config/`: Manages environment variables and settings using `@nestjs/config` and Joi validation.
    *   `database/`: Houses `PrismaService` and `DatabaseModule`, managing the globally available connection to PostgreSQL.
    *   `decorators/`: Custom decorators such as `@CurrentUser()` and `@Roles()`.
    *   `filters/`: Global exception filters like `HttpExceptionFilter` to format error responses consistently.
    *   `interceptors/`: Global interceptors like `LoggingInterceptor` for request logging and `TransformInterceptor` for wrapping responses in a `{ statusCode, message, data }` format.
    *   `guards/`: Global/shared guards such as `RolesGuard` for RBAC.

2.  **`modules/`**: Contains all the feature-specific business logic. Each domain is isolated into its own module.
    *   `auth/`: Handles authentication (JWT strategy, guards).
    *   `users/`: Manages user accounts and profiles.
    *   `businesses/`: Manages business listings.
    *   `categories/`: Manages categories for businesses/offers.
    *   `offers/`: Manages promotional offers created by businesses.
    *   `notifications/`: Handles sending and managing user notifications.
    *   `admin/`: Logic specifically intended for Super Admin roles.

3.  **`shared/`**: Contains resources shared across different modules to avoid circular dependencies.
    *   `enums/`: Contains enums like `UserRole` (exported from Prisma).
    *   `interfaces/`: Shared interfaces like `IRepository`.
    *   `dto/`: Common Data Transfer Objects.
    *   `types/`: Custom TypeScript type definitions.

## Database & Prisma
*   **Prisma Client:** We utilize the modern `@prisma/adapter-pg` driver adapter for efficient connection management with PostgreSQL, a requirement for Prisma v7 architecture.
*   **Schema Details:** The schema (`prisma/schema.prisma`) defines `User`, `Business`, `Category`, and `Offer` tables, fully configured with strict referential integrity.

## Strict Typing
The project uses strict TypeScript compilation (`"strict": true` in `tsconfig.json`) to guarantee strong type safety for future Next.js and Flutter client consumption.

## What has been accomplished so far:
1. Complete scaffolding of the modular backend.
2. Configuration of environments (`.env.development`, `.env.production`).
3. Setup of database connectivity, adapter, and pushing the schema to Neon PostgreSQL.
4. Setup of global pipes (for request validation), filters (for error handling), and interceptors (for logging and response transformation).
5. Foundation of JWT-based authentication and role-based access control (RBAC).
6. Resolution of strict-typing and module resolution errors for seamless development workflows.
