import { db } from "./db";
import { sql } from "drizzle-orm";

export async function initializeDatabase() {
  console.log("Initializing database...");
  
  try {
    // Check if we can connect to the database
    await db.execute(sql`SELECT 1`);
    console.log("Database connection successful!");
    
    // The tables should already exist from previous drizzle push
    // But let's ensure the sessions table exists for connect-pg-simple
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR NOT NULL PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      )
    `);
    
    // Create index if it doesn't exist
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire)
    `);
    
    console.log("Database initialization completed!");
    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    
    // If we can't connect to the database, provide helpful error message
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is not set!");
      console.error("Please ensure your PostgreSQL database is properly configured.");
    }
    
    throw error;
  }
}