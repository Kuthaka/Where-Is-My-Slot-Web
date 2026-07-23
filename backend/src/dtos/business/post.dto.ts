export interface PostDto {
  id: string;
  text: string;
  image?: string | null;
  tags: string[];
  location?: string | null;
  views: number;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}
