import { PrismaClient, UserRole } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const adminEmail = 'admin@localdial.com';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user with email ${adminEmail} already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      isPasswordSet: true,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`Successfully created Super Admin: ${admin.email} / Password: Admin@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
