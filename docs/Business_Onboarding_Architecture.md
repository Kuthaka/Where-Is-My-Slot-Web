# Business Onboarding Workflow Documentation

## Overview
The platform supports a robust, multi-step onboarding workflow for new businesses. It utilizes OTP-based email verification followed by a comprehensive data collection form built to feed directly into the backend `Business` schema.

## Database Additions (Prisma Schema)
1.  **`Otp` Model:**
    *   Tracks OTP verifications securely.
    *   Fields: `id`, `email`, `otp`, `expiresAt`, `createdAt`.
2.  **`Business` Model Updates:**
    *   Added `email`, `phone`, `timings` (JSON), `parking` (JSON), and `images` (String Array) to capture rich business details collected during onboarding.

## Backend Architecture
*   **MailerModule Setup:** Configured `@nestjs-modules/mailer` utilizing Nodemailer for SMTP email dispatch via the `ConfigModule`.
*   **`POST /api/v1/auth/send-otp`**: Generates a 6-digit code, saves it to the `Otp` table, and dispatches the code via email.
*   **`POST /api/v1/auth/verify-otp`**: Verifies the OTP. If successful, automatically registers the user (if they don't exist), assigns the `BUSINESS` role, and issues a JWT token.
*   **`POST /api/v1/businesses/onboard`**: Secure route (`@Roles(UserRole.BUSINESS)`) that creates the full Business record.

## Frontend Architecture (Next.js App Router)
The frontend implements a multi-stage flow across isolated pages:

1.  **Entry Point (`/list-business`)**
    *   **Email Request:** Prompts the user for their business email.
    *   **OTP Verification Modal:** Replaces the email form seamlessly using React state. On success, stores the JWT securely in `localStorage`.

2.  **Onboarding Form (`/list-business/onboarding`)**
    *   Protected route that checks for a JWT token before mounting.
    *   Implements an interactive progress bar tracking 5 stages:
        1.  **Basic Details:** Name, description.
        2.  **Contact:** Public email, phone number, physical address.
        3.  **Timings:** Opening and closing hours setup.
        4.  **Parking:** Boolean availability flags and slot estimation.
        5.  **Images:** Asset upload placeholder.
    *   Payload submission interacts securely with `POST /api/v1/businesses/onboard`.

3.  **Success State (`/list-business/success`)**
    *   Confirmation page displaying verification timeline logic.
    *   Provides a direct routing button to the future `Merchant Dashboard` login interface.
