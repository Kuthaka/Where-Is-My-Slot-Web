// ─── App Error Messages ────────────────────────────────────────────────────────

export const ErrorMessage = {
  // Auth
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_ALREADY_EXISTS: 'User with this email already exists',
  USERNAME_ALREADY_EXISTS: 'User with this username already exists',
  INVALID_OR_EXPIRED_OTP: 'Invalid or expired OTP',
  OLD_PASSWORD_REQUIRED: 'Old password is required to change password',
  INVALID_OLD_PASSWORD: 'Invalid old password',

  // Users
  USER_NOT_FOUND: 'User not found',

  // Businesses
  BUSINESS_NOT_FOUND: 'Business not found',
  BUSINESS_NOT_FOUND_FOR_USER: 'Business not found for the current user',
  NO_IMAGE_PROVIDED: 'No image file provided',

  // Posts
  POST_NOT_FOUND: 'Post not found',
  UNAUTHORIZED_POST_ACTION: 'Unauthorized to perform this action on the post',

  // Generic
  INTERNAL_ERROR: 'Internal server error',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden: insufficient permissions',
} as const;
