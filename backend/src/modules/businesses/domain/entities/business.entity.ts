export class Business {
  constructor(
    public readonly id: string,
    public ownerId: string,
    public name: string,
    public description: string | null,
    public email: string | null,
    public phone: string | null,
    public address: string | null,
    public latitude: number | null,
    public longitude: number | null,
    public timings: any,
    public parking: any,
    public images: string[],
    public isVerified: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
