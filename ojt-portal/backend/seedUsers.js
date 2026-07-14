
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

    const [trainee2, createdTrainee2] = await TraineeUser.findOrCreate({
      where: { username: "trainee2" },
      defaults: {
        nickname: "Trainee Two",
        NIC: "200109988776",
        email: "active_trainee@example.com",
        password: "trainee123",
        status: "Pending"
      }
    });
    if (!createdTrainee2) {
      trainee2.status = "Pending";
      await trainee2.save();
    }
    console.log(createdTrainee2 ? "Created trainee2" : "trainee2 status updated to Pending");

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

