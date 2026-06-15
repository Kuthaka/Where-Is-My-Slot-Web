# API Documentation: Auth & Business Onboarding

This document provides a comprehensive reference for the Authentication and Business Onboarding APIs in the WhereIsMySlot backend.

Base URL: `http://localhost:5000/api/v1` (Adjust to your environment)

---

## 1. Authentication (`/auth`)

The authentication system supports both passwordless (OTP) and password-based login flows. By default, logout is handled client-side by destroying the stored JWT token.

### 1.1. Send OTP
Sends a one-time password to the provided email address for initial login or passwordless entry.

- **Endpoint**: `POST /auth/send-otp`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "OTP sent successfully to user@example.com"
  }
  ```

### 1.2. Verify OTP
Verifies the OTP and logs the user in. If the user does not exist, an account is automatically created with the role `BUSINESS`.

- **Endpoint**: `POST /auth/verify-otp`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456" 
  }
  ```
  *(Note: Currently, OTP verification is bypassed in dev for smooth testing by sending `000000`)*
- **Response**:
  ```json
  {
    "accessToken": "eyJhbG...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "user",
      "role": "BUSINESS",
      "isPasswordSet": false,
      "isActive": true
    }
  }
  ```

### 1.3. Login with Password
Standard login flow using email and password. 

- **Endpoint**: `POST /auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "eyJhbG...",
    "user": { ... }
  }
  ```

### 1.4. Set / Update Password
Allows a logged-in user to set a password (if they logged in via OTP) or update their existing password.

- **Endpoint**: `POST /auth/set-password`
- **Auth Required**: Yes (Bearer Token)
- **Request Body**:
  ```json
  {
    "newPassword": "newsecurepassword123",
    "oldPassword": "currentpassword123" // Required ONLY if isPasswordSet is true
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```

### 1.5. Get Current User
Fetches the currently authenticated user's profile details.

- **Endpoint**: `GET /auth/me`
- **Auth Required**: Yes (Bearer Token)
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "isPasswordSet": true,
    "role": "BUSINESS",
    "isActive": true,
    "createdAt": "2026-06-15T...",
    "updatedAt": "2026-06-15T..."
  }
  ```

---

## 2. Business Management (`/businesses`)

The businesses API manages the merchant profiles. Newly onboarded businesses are automatically verified and approved.

### 2.1. Onboard Business
Creates a new business profile linked to the authenticated user.

- **Endpoint**: `POST /businesses/onboard`
- **Auth Required**: Yes (Bearer Token), Roles: `BUSINESS` or `SUPER_ADMIN`
- **Request Body** (All fields except `name` and `email` are optional, but standard flows submit comprehensive data):
  ```json
  {
    "name": "The Grand Cafe",
    "email": "contact@grandcafe.com",
    "phone": "+91 9876543210",
    "primaryCategory": "Restaurant",
    "description": "A wonderful place for coffee and food.",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "timings": {
      "monday": { "open": "09:00", "close": "18:00" },
      "tuesday": { "open": "09:00", "close": "18:00" }
    },
    "parking": {
      "available": true,
      "slots": 10,
      "valet": false
    },
    "amenities": ["WiFi", "Air Conditioning"],
    "images": ["https://s3.url/image1.jpg"]
  }
  ```
  *See the `OnboardBusinessDto` or Prisma schema for all accepted optional fields like `latitude`, `longitude`, `subCategories`, `socialLinks`, etc.*
- **Response**: Returns the fully created business object with `isVerified: true` and `status: "APPROVED"`.

### 2.2. Upload Image
Uploads a media file (logo, cover photo, gallery images) to the server/storage.

- **Endpoint**: `POST /businesses/upload-image`
- **Auth Required**: Yes (Bearer Token), Roles: `BUSINESS` or `SUPER_ADMIN`
- **Headers**: `Content-Type: multipart/form-data`
- **Request Body**:
  - `file`: The image file binary.
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "url": "https://url-to-uploaded-image.jpg"
    }
  }
  ```

### 2.3. Get My Business
Retrieves the business profile associated with the currently authenticated user.

- **Endpoint**: `GET /businesses/me`
- **Auth Required**: Yes (Bearer Token), Roles: `BUSINESS` or `SUPER_ADMIN`
- **Response**: 
  Returns the complete business JSON object, or `null` if the user hasn't onboarded yet.

### 2.4. Admin: Get All Businesses
Retrieves all businesses on the platform.

- **Endpoint**: `GET /businesses`
- **Auth Required**: Yes (Bearer Token), Roles: `SUPER_ADMIN`
- **Response**: Array of business objects.

### 2.5. Admin: Approve / Reject Business
Manually override a business's approval status.

- **Endpoint**: `POST /businesses/:id/approve` OR `POST /businesses/:id/reject`
- **Auth Required**: Yes (Bearer Token), Roles: `SUPER_ADMIN`
- **Response**: Returns the updated business object with the new `status` and `isVerified` flag.

### 2.6. Admin: Directly Add Business
Allows an admin to add a business directly without associating it with a user owner immediately (or assigning an arbitrary `ownerId`).

- **Endpoint**: `POST /businesses/admin/add`
- **Auth Required**: Yes (Bearer Token), Roles: `SUPER_ADMIN`
- **Request Body**: Same as `OnboardBusinessDto`
- **Response**: Returns the newly created, auto-approved business.

---

## 3. Key Data Entities

### User Object
| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Unique identifier |
| `name` | String | User's display name |
| `email` | String | Unique email address |
| `isPasswordSet` | Boolean | True if user has set a password |
| `role` | Enum | `USER`, `BUSINESS`, or `SUPER_ADMIN` |
| `isActive` | Boolean | Account status |

### Business Object (Core Fields)
| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Unique identifier |
| `ownerId` | String (UUID) | ID of the User who owns the business |
| `name` | String | Name of the business |
| `email` | String | Primary contact email |
| `phone` | String | Primary contact phone |
| `primaryCategory` | String | Main category (e.g., "Restaurant") |
| `address`, `city`, `state`, `pincode` | String | Location details |
| `latitude`, `longitude` | Float | Geolocation coordinates |
| `timings` | JSON | Operating hours mapping |
| `parking` | JSON | Parking configuration |
| `amenities` | Array of Strings | List of features (e.g., "WiFi") |
| `images` | Array of Strings | List of image URLs |
| `isVerified` | Boolean | Verification flag (defaults to true now) |
| `status` | String | `APPROVED`, `PENDING`, `REJECTED` |
