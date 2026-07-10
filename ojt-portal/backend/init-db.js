import { initializeDatabase } from "./src/database/databaseinit.js";

async function run() {
  try {
    await initializeDatabase();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed.");
    process.exit(1);
  }
}

run();
