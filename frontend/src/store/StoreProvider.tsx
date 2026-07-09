"use client";

import { Provider } from 'react-redux';
import { store, AppDispatch } from './index';
import { useEffect } from 'react';
import { fetchCurrentUser, stopLoading } from './slices/authSlice';

// Create a component that initializes the app state
function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only fetch if we have a token and haven't fetched yet
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(fetchCurrentUser() as any);
    } else {
      store.dispatch(stopLoading());
    }
  }, []);

  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>
        {children}
      </AppInitializer>
    </Provider>
  );
}
