import 'dotenv/config';
import { createApp } from './app';
import connectDB from './config/database.config';
import { connectCloudinary } from './config/cloudinary';

// ─── Bootstrap ─────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '5001', 10);

async function bootstrap(): Promise<void> {
  try {
    await connectDB();
    connectCloudinary();

    const app = createApp();

    app.listen(PORT, () => {
      console.log('');
      console.log('  ┌─────────────────────────────────────────┐');
      console.log(`  │  🚀 Where Is My Slot API v2              │`);
      console.log(`  │  Running on http://localhost:${PORT}       │`);
      console.log(`  │  Environment: ${process.env.NODE_ENV ?? 'development'}               │`);
      console.log('  └─────────────────────────────────────────┘');
      console.log('');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('[Server] SIGTERM received. Shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('[Server] SIGINT received. Shutting down gracefully...');
      process.exit(0);
    });
  } catch (error) {
    console.error('[Bootstrap] Fatal error during startup:', error);
    process.exit(1);
  }
}

bootstrap();
