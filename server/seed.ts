import { db } from "./db";
import { users } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  const demoEmail = "demo@chakravya.com";
  const demoPassword = "demo123";

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, demoEmail))
    .limit(1);

  if (existingUser.length > 0) {
    console.log("✅ Demo user already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await db.insert(users).values({
    email: demoEmail,
    passwordHash,
    role: "user",
    firstName: "Demo",
    lastName: "User",
  });

  console.log("✅ Demo user created successfully");
  console.log("   Email: demo@chakravya.com");
  console.log("   Password: demo123");

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
