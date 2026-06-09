# Where-Is-My-Slot - API Documentation

Base URL: `/api/v1`

## Global Response Format
All successful responses are automatically wrapped by the `TransformInterceptor` to maintain consistency:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

Errors are formatted globally by the `HttpExceptionFilter`:
```json
{
  "statusCode": 400,
  "timestamp": "2026-06-09T09:00:00.000Z",
  "path": "/api/v1/endpoint",
  "message": "Error details..."
}
```

---

## 1. System Endpoints

### Health Check
Validates that the server is online and successfully connected to the database.

*   **URL:** `/health`
*   **Method:** `GET`
*   **Authentication Required:** No
*   **Response (200 OK):**
    ```json
    {
      "statusCode": 200,
      "message": "Success",
      "data": {
        "status": "ok",
        "database": "connected",
        "timestamp": "2026-06-09T09:54:07.992Z"
      }
    }
    ```
*   **Response (500 Internal Server Error):**
    ```json
    {
      "statusCode": 500,
      "timestamp": "2026-06-09T09:54:07.992Z",
      "path": "/api/v1/health",
      "message": "Internal server error"
    }
    ```

---

## Future Endpoints (To Be Implemented)

### 2. Authentication (`/auth`)
*   `POST /auth/register` - Create a new user or business account.
*   `POST /auth/login` - Authenticate and return JWT access/refresh tokens.
*   `POST /auth/refresh` - Refresh access token.

### 3. Users (`/users`)
*   `GET /users/me` - Get current authenticated user profile.
*   `PATCH /users/me` - Update profile details.

### 4. Businesses (`/businesses`)
*   `GET /businesses` - List businesses (with geolocation/filtering).
*   `GET /businesses/:id` - Get specific business details.
*   `POST /businesses` - Create a new business (Requires `BUSINESS` role).
*   `PATCH /businesses/:id` - Update business details.

### 5. Offers (`/offers`)
*   `GET /offers` - Fetch active flash deals and offers.
*   `POST /offers` - Create a new offer for a business (Requires `BUSINESS` role).

### 6. Categories (`/categories`)
*   `GET /categories` - List all available categories.

### 7. Admin (`/admin`)
*   *(Endpoints restricted to `SUPER_ADMIN` role for platform management)*
