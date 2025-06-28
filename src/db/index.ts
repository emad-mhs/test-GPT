// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';

// import * as schema from '@/db/schema';

// const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
// export const db = drizzle(sql, { schema });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from '@/db/schema';

// neonConfig.fetchConnectionCache = true; // Opt-in to connection caching for better performance

// Initialize Neon Postgres connection
const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle(sql, { schema });
