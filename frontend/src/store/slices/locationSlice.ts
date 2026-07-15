import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationState {
  currentLocation: LocationData | null;
  loading: boolean;
  error: string | null;
}

const getInitialLocation = (): LocationData | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('app_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const initialState: LocationState = {
  currentLocation: getInitialLocation(),
  loading: false,
  error: null,
};

export const saveLocationToBackend = createAsyncThunk(
  'location/saveToBackend',
  async (location: LocationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/v1/location/set', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(location)
        });
      }
      return location;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<LocationData>) => {
      state.currentLocation = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_location', JSON.stringify(action.payload));
      }
    },
    clearLocation: (state) => {
      state.currentLocation = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('app_location');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveLocationToBackend.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveLocationToBackend.fulfilled, (state, action) => {
        state.currentLocation = action.payload;
        state.loading = false;
        if (typeof window !== 'undefined') {
          localStorage.setItem('app_location', JSON.stringify(action.payload));
        }
      })
      .addCase(saveLocationToBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
