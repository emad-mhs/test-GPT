import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

config({ path: '.env.local' });

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

main();
