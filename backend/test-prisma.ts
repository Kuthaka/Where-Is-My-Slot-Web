import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    
    console.log("Connecting...");
    const user = await prisma.user.findUnique({ where: { username: 'test' } });
    console.log("User:", user);
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    process.exit(0);
  }
}
main();
