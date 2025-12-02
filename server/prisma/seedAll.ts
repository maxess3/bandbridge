import prisma from "../src/db/db.config";
import { execSync } from "child_process";

async function main() {
  console.log("🚀 Starting complete seeding process...\n");

  try {
    // Étape 1: Seed des instruments
    console.log("📚 Step 1: Seeding instruments...");
    execSync("npm run seed:instruments", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("✅ Instruments seeded successfully!\n");

    // Étape 2: Seed des profils
    console.log("👥 Step 2: Seeding profiles...");
    execSync("npm run seed:profiles", { stdio: "inherit", cwd: process.cwd() });
    console.log("✅ Profiles seeded successfully!\n");

    console.log("🎉 All seeding completed successfully!");
    console.log("📊 Database now contains:");
    console.log("   - Instrument types");
    console.log("   - 50 user profiles with instruments and social links");
    console.log("   - Sample data for testing and development");
  } catch (error) {
    console.error("❌ Error during seeding process:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
