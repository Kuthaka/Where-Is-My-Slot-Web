export interface UserDto {
  id: string;
  name: string;
  username: string | null;
  email: string;
  role: string;
  isActive: boolean;
  isPasswordSet: boolean;
  passwordHash?: string; // Kept optional for internal use (auth validation)
  location?: { address: string; latitude: number; longitude: number };
  createdAt: Date;
  updatedAt: Date;
}
