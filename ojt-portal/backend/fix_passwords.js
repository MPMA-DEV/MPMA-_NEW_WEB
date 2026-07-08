import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

const sequelize = new Sequelize('ojt_portal', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

async function fixPasswords() {
  try {
    const [users] = await sequelize.query("SELECT * FROM trainee_user");
    for (let user of users) {
      if (!user.password.startsWith('$2')) {
        console.log(`Hashing password for ${user.username}...`);
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        await sequelize.query("UPDATE trainee_user SET password = ? WHERE id = ?", {
          replacements: [hashedPassword, user.id]
        });
        console.log(`Fixed password for ${user.username}`);
      }
    }
    console.log("All done!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

fixPasswords();
