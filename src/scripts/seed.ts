import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// import {
//   categories,
//   contacts,
//   departments,
//   documents,
//   mailCcs,
//   mailDepartments,
//   mails,
//   receivers,
//   users,
// } from '@/db/schema';

// import {
//   SEED_MAILS1,
//   SEED_MAILS2,
//   SEED_MAILS3,
//   SEED_MAILS4,
//   SEED_MAILS5,
//   SEED_MAILS6,
//   SEED_MAILS7,
//   SEED_CONTACTS,
//   SEED_USERS,
//   SEED_CATEGORIES,
//   SEED_DOCUMENTS,
//   SEED_DEPARTMENTS,
//   SEED_MAIL_CC,
//   SEED_MAIL_DEPARTMENT,
// } from './data';

config({ path: '.env.local' });

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
const db = drizzle(sql);

// const SEED_USER_ID = 'aa848106-a2f6-40ed-a35d-ef1d51a55dd2';

const main = async () => {
  try {
    console.log({ db });
    // Reset database
    // await db.delete(departments).execute();
    // await db.delete(users).execute();
    // await db.delete(categories).execute();
    // await db.delete(documents).execute();
    // await db.delete(contacts).execute();
    // await db.delete(receivers).execute();
    // await db.delete(mails).execute();
    // Seed departments
    // await db.insert(departments).values(SEED_DEPARTMENTS).execute();
    // Seed users
    // await db.insert(users).values(SEED_USERS).execute();
    // Seed contacts
    // await db.insert(contacts).values(SEED_CONTACTS).execute();
    // Seed categories
    // await db.insert(categories).values(SEED_CATEGORIES).execute();
    // Seed documents
    // await db.insert(documents).values(SEED_DOCUMENTS).execute();
    // Seed mails
    // change date mode to "date" in drizzle
    // await db.insert(mails).values(SEED_MAILS1).execute();
    // await db.insert(mails).values(SEED_MAILS2).execute();
    // await db.insert(mails).values(SEED_MAILS3).execute();
    // await db.insert(mails).values(SEED_MAILS4).execute();
    // await db.insert(mails).values(SEED_MAILS5).execute();
    // await db.insert(mails).values(SEED_MAILS6).execute();
    // await db.insert(mails).values(SEED_MAILS7).execute();
    // await db.insert(mailCcs).values(SEED_MAIL_CC).execute();
    // await db.insert(mailDepartments).values(SEED_MAIL_DEPARTMENT).execute();
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
};

main();
