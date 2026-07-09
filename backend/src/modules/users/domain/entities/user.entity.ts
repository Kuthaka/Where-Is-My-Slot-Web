// ─── User Domain Entity ────────────────────────────────────────────────────────

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public username: string | null,
    public email: string,
    public passwordHash: string,
    public isPasswordSet: boolean,
    public role: string,
    public isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
