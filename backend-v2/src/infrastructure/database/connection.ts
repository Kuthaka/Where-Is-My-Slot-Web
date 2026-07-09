import mongoose from 'mongoose';

// ─── Database Connection ────────────────────────────────────────────────────────

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('[Database] Connected to MongoDB ✓');

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[Database] Disconnected from MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[Database] Connection error:', err);
    });
  } catch (error) {
    console.error('[Database] Failed to connect:', error);
    throw error;
  }
}

export function getDatabaseState(): number {
  return mongoose.connection.readyState;
}
