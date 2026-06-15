import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api/v1';

export interface Post {
  id: string;
  text: string;
  image?: string;
  tags?: string[];
  location?: string;
  createdAt: string;
  businessId: string;
  business: { id: string; name: string; username: string; logo?: string; isVerified: boolean };
  _count: { likes: number; comments: number };
  isLikedByMe: boolean;
}

interface PostsState {
  feed: Post[];
  nextCursor: string | null;
  hasMore: boolean;
  loading: boolean;
  initialLoaded: boolean;
  error: string | null;
}

const initialState: PostsState = {
  feed: [],
  nextCursor: null,
  hasMore: true,
  loading: false,
  initialLoaded: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ cursor, userId }: { cursor?: string; userId?: string }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ limit: '5' });
      if (cursor) params.append('cursor', cursor);
      if (userId) params.append('userId', userId);

      const res = await fetch(`${API_URL}/posts?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      // Handle both wrapped { data: ... } and direct response
      const payload = data.data ?? data;
      return { posts: payload.posts ?? [], nextCursor: payload.nextCursor ?? null };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.feed.unshift(action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.feed = state.feed.filter(p => p.id !== action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const idx = state.feed.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.feed[idx] = action.payload;
    },
    toggleLikeOptimistic: (state, action: PayloadAction<string>) => {
      const post = state.feed.find(p => p.id === action.payload);
      if (post) {
        if (post.isLikedByMe) {
          post._count.likes -= 1;
          post.isLikedByMe = false;
        } else {
          post._count.likes += 1;
          post.isLikedByMe = true;
        }
      }
    },
    resetFeed: (state) => {
      state.feed = [];
      state.nextCursor = null;
      state.hasMore = true;
      state.initialLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.initialLoaded = true;
        // Deduplicate before appending
        const existingIds = new Set(state.feed.map(p => p.id));
        const newPosts = action.payload.posts.filter((p: Post) => !existingIds.has(p.id));
        state.feed.push(...newPosts);
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.nextCursor !== null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addPost, removePost, updatePost, toggleLikeOptimistic, resetFeed } = postsSlice.actions;
export default postsSlice.reducer;
