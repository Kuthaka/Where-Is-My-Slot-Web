// ─── Post Domain Entity ────────────────────────────────────────────────────────

export interface PostProps {
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

export class Post {
  public props: PostProps;

  constructor(props: PostProps) {
    this.props = props;
  }
}
