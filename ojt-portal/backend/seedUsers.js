
import "dotenv/config";
import { TraineeUser, Staff } from "./src/models/index.js";
import { sequalize } from "./src/database/sequlize.js";

async function seed() {
  try {
    await sequalize.authenticate();
    
    const [trainee, createdTrainee] = await TraineeUser.findOrCreate({
      where: { username: "trainee1" },
      defaults: {
        nickname: "Trainee One",
        NIC: "987654321v",
        email: "trainee1@example.com",
        password: "trainee123",
        status: "Active"
      }
    });
    console.log(createdTrainee ? "Created trainee1" : "trainee1 already exists");

    const [admin, createdAdmin] = await Staff.findOrCreate({
      where: { username: "admin1" },
      defaults: {
        email: "admin1@example.com",
        password: "admin123",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        status: "Active"
      }
    });
    console.log(createdAdmin ? "Created admin1" : "admin1 already exists");

  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    process.exit();
  }
}
seed();

