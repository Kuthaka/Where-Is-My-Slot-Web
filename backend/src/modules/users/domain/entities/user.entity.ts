export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public isPasswordSet: boolean,
    public role: string,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
