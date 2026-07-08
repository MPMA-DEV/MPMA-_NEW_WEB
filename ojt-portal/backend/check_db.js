import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

const sequelize = new Sequelize('ojt_portal', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

async function check() {
  try {
    const [results] = await sequelize.query("SELECT * FROM trainee_user WHERE username = 'trainee2'");
    if (results.length === 0) {
      console.log('User trainee2 not found');
    } else {
      const user = results[0];
      console.log('User found:', user);
      const match = await bcrypt.compare('trainee123', user.password);
      console.log('Password valid:', match);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
