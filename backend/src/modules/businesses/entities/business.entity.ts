// ─── Business Domain Entity ────────────────────────────────────────────────────

export interface BusinessProps {
  id: string;
  ownerId: string | null;
  // Merchant auth
  contactEmail: string;
  passwordHash?: string | null;
  isPasswordSet: boolean;
  // Profile
  name: string;
  username?: string | null;
  tagline?: string | null;
  description?: string | null;
  establishedYear?: number | null;
  gstNumber?: string | null;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  whatsappNumber?: string | null;
  mobileNumbers: string[];
  landlineNumbers: string[];
  emails: string[];
  address?: string | null;
  pincode?: string | null;
  plotNo?: string | null;
  buildingName?: string | null;
  streetName?: string | null;
  landmark?: string | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  timings?: Record<string, unknown> | null;
  primaryCategory?: string | null;
  subCategories: string[];
  amenities: string[];
  parking?: Record<string, unknown> | null;
  logo?: string | null;
  coverPhoto?: string | null;
  images: string[];
  socialLinks?: Record<string, unknown> | null;
  isVerified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Business {
  public props: BusinessProps;

  constructor(props: BusinessProps) {
    this.props = props;
  }
}
